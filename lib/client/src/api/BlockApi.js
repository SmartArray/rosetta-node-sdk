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


import ApiClient from "../ApiClient";
import BlockRequest from '../model/BlockRequest';
import BlockResponse from '../model/BlockResponse';
import BlockTransactionRequest from '../model/BlockTransactionRequest';
import BlockTransactionResponse from '../model/BlockTransactionResponse';
import Error from '../model/Error';

/**
* Block service.
* @module api/BlockApi
* @version 1.3.1
*/
export default class BlockApi {

    /**
    * Constructs a new BlockApi. 
    * @alias module:api/BlockApi
    * @class
    * @param {module:ApiClient} [apiClient] Optional API client implementation to use,
    * default to {@link module:ApiClient#instance} if unspecified.
    */
    constructor(apiClient) {
        this.apiClient = apiClient || ApiClient.instance;
    }


    /**
     * Callback function to receive the result of the block operation.
     * @callback module:api/BlockApi~blockCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BlockResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a Block
     * Get a block by its Block Identifier. If transactions are returned in the same call to the node as fetching the block, the response should include these transactions in the Block object. If not, an array of Transaction Identifiers should be returned so /block/transaction fetches can be done to get all transaction information.
     * @param {module:model/BlockRequest} blockRequest 
     * @param {module:api/BlockApi~blockCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BlockResponse}
     */
    block(blockRequest, callback) {
      let postBody = blockRequest;
      // verify the required parameter 'blockRequest' is set
      if (blockRequest === undefined || blockRequest === null) {
        throw new Error("Missing the required parameter 'blockRequest' when calling block");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = BlockResponse;
      return this.apiClient.callApi(
        '/block', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }

    /**
     * Callback function to receive the result of the blockTransaction operation.
     * @callback module:api/BlockApi~blockTransactionCallback
     * @param {String} error Error message, if any.
     * @param {module:model/BlockTransactionResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * Get a Block Transaction
     * Get a transaction in a block by its Transaction Identifier. This endpoint should only be used when querying a node for a block does not return all transactions contained within it.  All transactions returned by this endpoint must be appended to any transactions returned by the /block method by consumers of this data. Fetching a transaction by hash is considered an Explorer Method (which is classified under the Future Work section).  Calling this endpoint requires reference to a BlockIdentifier because transaction parsing can change depending on which block contains the transaction. For example, in Bitcoin it is necessary to know which block contains a transaction to determine the destination of fee payments. Without specifying a block identifier, the node would have to infer which block to use (which could change during a re-org).  Implementations that require fetching previous transactions to populate the response (ex: Previous UTXOs in Bitcoin) may find it useful to run a cache within the Rosetta server in the /data directory (on a path that does not conflict with the node).
     * @param {module:model/BlockTransactionRequest} blockTransactionRequest 
     * @param {module:api/BlockApi~blockTransactionCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/BlockTransactionResponse}
     */
    blockTransaction(blockTransactionRequest, callback) {
      let postBody = blockTransactionRequest;
      // verify the required parameter 'blockTransactionRequest' is set
      if (blockTransactionRequest === undefined || blockTransactionRequest === null) {
        throw new Error("Missing the required parameter 'blockTransactionRequest' when calling blockTransaction");
      }

      let pathParams = {
      };
      let queryParams = {
      };
      let headerParams = {
      };
      let formParams = {
      };

      let authNames = [];
      let contentTypes = ['application/json'];
      let accepts = ['application/json'];
      let returnType = BlockTransactionResponse;
      return this.apiClient.callApi(
        '/block/transaction', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, null, callback
      );
    }


}