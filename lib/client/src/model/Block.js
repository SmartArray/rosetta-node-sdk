/**
 * Rosetta
 * A Standard for Blockchain Interaction
 *
 * The version of the OpenAPI document: 1.3.1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 *
 */

import ApiClient from '../ApiClient';
import BlockIdentifier from './BlockIdentifier';
import Transaction from './Transaction';

/**
 * The Block model module.
 * @module model/Block
 * @version 1.3.1
 */
class Block {
    /**
     * Constructs a new <code>Block</code>.
     * Blocks contain an array of Transactions that occurred at a particular BlockIdentifier.
     * @alias module:model/Block
     * @param blockIdentifier {module:model/BlockIdentifier} 
     * @param parentBlockIdentifier {module:model/BlockIdentifier} 
     * @param timestamp {Number} The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
     * @param transactions {Array.<module:model/Transaction>} 
     */
    constructor(blockIdentifier, parentBlockIdentifier, timestamp, transactions) { 
        
        Block.initialize(this, blockIdentifier, parentBlockIdentifier, timestamp, transactions);
    }

    /**
     * Initializes the fields of this object.
     * This method is used by the constructors of any subclasses, in order to implement multiple inheritance (mix-ins).
     * Only for internal use.
     */
    static initialize(obj, blockIdentifier, parentBlockIdentifier, timestamp, transactions) { 
        obj['block_identifier'] = blockIdentifier;
        obj['parent_block_identifier'] = parentBlockIdentifier;
        obj['timestamp'] = timestamp;
        obj['transactions'] = transactions;
    }

    /**
     * Constructs a <code>Block</code> from a plain JavaScript object, optionally creating a new instance.
     * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
     * @param {Object} data The plain JavaScript object bearing properties of interest.
     * @param {module:model/Block} obj Optional instance to populate.
     * @return {module:model/Block} The populated <code>Block</code> instance.
     */
    static constructFromObject(data, obj) {
        if (data) {
            obj = obj || new Block();

            if (data.hasOwnProperty('block_identifier')) {
                obj['block_identifier'] = BlockIdentifier.constructFromObject(data['block_identifier']);
            }
            if (data.hasOwnProperty('parent_block_identifier')) {
                obj['parent_block_identifier'] = BlockIdentifier.constructFromObject(data['parent_block_identifier']);
            }
            if (data.hasOwnProperty('timestamp')) {
                obj['timestamp'] = ApiClient.convertToType(data['timestamp'], 'Number');
            }
            if (data.hasOwnProperty('transactions')) {
                obj['transactions'] = ApiClient.convertToType(data['transactions'], [Transaction]);
            }
            if (data.hasOwnProperty('metadata')) {
                obj['metadata'] = ApiClient.convertToType(data['metadata'], Object);
            }
        }
        return obj;
    }


}

/**
 * @member {module:model/BlockIdentifier} block_identifier
 */
Block.prototype['block_identifier'] = undefined;

/**
 * @member {module:model/BlockIdentifier} parent_block_identifier
 */
Block.prototype['parent_block_identifier'] = undefined;

/**
 * The timestamp of the block in milliseconds since the Unix Epoch. The timestamp is stored in milliseconds because some blockchains produce blocks more often than once a second.
 * @member {Number} timestamp
 */
Block.prototype['timestamp'] = undefined;

/**
 * @member {Array.<module:model/Transaction>} transactions
 */
Block.prototype['transactions'] = undefined;

/**
 * @member {Object} metadata
 */
Block.prototype['metadata'] = undefined;






export default Block;
