const AppError = require("../utils/Error-handler/AppError");
const { StatusCodes } = require("http-status-codes");

/**
 * @class CrudFunctions
 * @description Generic CRUD utility class.
 * Supports create, read, update, and delete operations with consistent error handling.
 */
class CrudFunctions {
  /**
   * @constructor
   * @param {import('sequelize').Model} model - Sequelize model instance
   */
  constructor(model) {
    this.model = model;
  }

  /**
   * Creates a new record.
   * @param {object} data - Data object to create
   * @returns {Promise<object>} - Created record
   */
  async create(data) {
    try {
      const response = await this.model.create(data);
      console.log(data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Finds a record by primary key.
   * @param {number|string} id - Primary key value
   * @returns {Promise<object>} - Found record
   * @throws {AppError} - Throws if record is not found
   */
  async find(id) {
    try {
      const response = await this.model.findByPk(id);
      if (!response) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves all records.
   * @returns {Promise<Array<object>>} - List of all records
   */
  async findAll() {
    try {
      const response = await this.model.findAll();
      return response;
    } catch (error) {
      console.log(`Error retrieving data from ${this.model.name}`);
      throw error;
    }
  }

  /**
   * Updates a record by primary key.
   * @param {number|string} id - Record identifier
   * @param {object} data - Data to update
   * @returns {Promise<[number]>} - Result array containing number of affected rows
   * @throws {AppError} - Throws if record is not found
   */
  async update(id, data) {
    try {
      const response = await this.model.update(data, {
        where: { id }
      });

      if (!response[0]) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }

      return response;
    } catch (error) {
      console.log(`Error updating data in ${this.model.name}`);
      throw error;
    }
  }

  /**
   * Deletes a record by primary key.
   * @param {number|string} id - Record identifier
   * @returns {Promise<number>} - Number of deleted records
   * @throws {AppError} - Throws if record is not found
   */
  async delete(id) {
    try {
      const response = await this.model.destroy({
        where: { id }
      });

      if (!response) {
        throw new AppError(
          `Resource not found for the ID ${id}`,
          StatusCodes.NOT_FOUND
        );
      }

      return response;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CrudFunctions;