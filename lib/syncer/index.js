const RosettaClient = require('rosetta-client');
const RosettaFetcher = require('../fetcher');
const EventEmitter = require('events');
const { SyncerError } = require('../errors');
const SyncEvents = require('./events');
const sleep = require('../utils/sleep');
const logger = require('../logger');

/**
 * RosettaSyncer
 * Emits blockAdded and blockRemoved Events during sync.
 * Emits cancel if sync was cancelled.
 */
class RosettaSyncer extends EventEmitter {
  constructor({ networkIdentifier, fetcher, handler, pastBlocks = [],
    maxSync = 999, pastBlockSize = 40, defaultSyncSleep = 5000 }) {

    this.networkIdentifier = networkIdentifier;
    this.fetcher = fetcher;
    this.handler = handler;
    this.pastBlocks = pastBlocks;

    this.genesisBlock = null;
    this.nextIndex = null;

    this.maxSync = maxSync;
    this.pastBlockSize = pastBlockSize;
    this.defaultSyncSleep = defaultSyncSleep;

    // ToDo: Type checks
  }

  async setStart(startIndex = -1) {
    const networkStatus = await this.fetcher.networkStatusRetry(this.networkIdentifier);

    if (startIndex != -1) {
      this.nextIndex = startIndex;
      return;
    }

    this.gensesisBlock = networkStatus.genesis_block_identifier;
    this.nextIndex = networkStatus.genesis_block_identifier.index;
    return;
  }

  async nextSyncableRange(endIndexIn) {
    let endIndex;

    if (this.nextIndex == -1) {
      throw new SyncerError('Unable to determine current head');
    }

    if (endIndex == -1) {
      const networkStatus = await this.fetcher.networkStatusRetry(this.networkIdentifier);
      endIndex = networkStatus.current_block_identifier.index;
    }

    if (this.nextIndex >= endIndex) {
      return {
        halt: true,
        rangeEnd: -1,
      };
    }

    if (endIndex - this.nextIndex > maxSync) {
      endIndex = this.nextIndex + maxSync;
    }

    return {
      halt: false,
      rangeEnd: endIndex,
    };
  }

  async checkRemove(block) {
    // ToDo: Type check block

    if (this.pastBlocks.length == 0) {
      return {
        removable: false,
        lastBlock: null,
      };
    }

    // Ensure processing correct index
    if (block.block_identifier.index != this.nextIndex) {
      throw new SyncerError(
        `Get block ${block.block_identifier.index} instead of ${this.nextIndex}`
      );
    }

    // Check if block parent is head
    const lastBlock = this.pastBlocks[this.pastBlocks.length - 1];
    if (String.from(block.parent_block_identifier) != String.from(lastBlock)) {
      if (String.from(this.genesisBlock) == String.from(lastBlock)) {
        throw new SyncerError('Cannot remove genesis block');
      }

      // Block can be removed.
      return {
        removable: true,
        lastBlock,
      };
    }

    return {
      removable: false,
      lastBlock: lastBlock,
    };
  }

  async processBlock(block) {
    // ToDo: Type check block

    const { shouldRemove, lastBlock } = this.checkRemove(block);

    if (shouldRemove) {
      // Notify observers that a block was removed
      this.emit(SyncEvents.BLOCK_REMOVED, lastBlock);

      // Remove the block internally
      this.pastBlocks.pop();
      this.nextIndex = lastBlock.index;
      return;
    }

    // Notify observers that a block was added
    this.emit(SyncEvents.BLOCK_ADDED, block);

    // Add the block internally
    this.pastBlocks.push(block.block_identifier);
    if (this.pastBlocks.length > this.pastBlockSize) {
      this.pastBlocks.shift();
    }

    this.nextIndex = block.block_identifier.index + 1;
  }

  async syncRange(endIndex) {
    const blockMap = this.fetcher.blockRange(
      this.networkIdentifier,
      this.nextIndex,
      endIndex
    );

    while (this.nextIndex <= endIndex) {
      // ToDo: Map?
      let block = blockMap[this.nextIndex];

      if (!block) {
        // Re-org happened. Refetch the next block.
        const partialBlockIdentifier = new RosettaClient.PartialBlockIdentifier({
          index: this.nextIndex,
        });

        block = this.fetcher.blockRetry(
          this.networkIdentifier,
          partialBlockIdentifier,
        );

      } else {
        // We are going to refetch the block.
        // Delete the current version of it.
        delete blockMap[this.nextIndex];
      }

      this.processBlock(block);
    }
  }

  /** Syncs the blockchain in the requested range.
   *  Endless cycle unless an error happens or the requested range was synced successfully.
   * @param {number} startIndex - Index to start sync from
   * @param {number} endIndex - Index to end sync at (inclusive).
   */
  async sync(startIndex, endIndex) {
    this.emit(SyncEvents.SYNC_CANCELLED);

    try {
      await this.setStart(startIndex);
    } catch (e) {
      throw new SyncerError(`Unable to set sync start index: ${e.message}`);
    }

    while (true) {
      let rangeEnd;
      let halt;

      try {
        const result = await this.nextSyncableRange(endIndex);
        rangeEnd = result.rangeEnd;
        halt = result.halt;
      } catch(e) {
        throw new SyncerError(`Unable to get next syncable range: ${e.message}`);
      }

      if (halt) {
        if (endIndex != -1) {
          // Quit Sync.
          break;
        }

        logger.verbose(`Syncer at tip ${this.nextIndex}... Sleeping...`);
        await sleep(this.defaultSyncSleep);
        continue;
      }

      logger.verbose(`Syncing ${this.nextIndex}-${rangeEnd}`);

      try {
        await this.syncRange(rangeEnd);
      } catch (e) {
        throw new SyncerError(`Unable to sync to ${rangeEnd}: ${e.message}`);
      }
    }

    if (startIndex == -1) {
      startIndex = this.genesisBlock.index;
    }

    logger.info(`Finished Syncing ${startIndex}-${endIndex}`);
  }
}

module.exports = RosettaSyncer;