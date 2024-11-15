const PRODUCT_NOT_FOUND = "Product not found"
const PRODUCT_ALREADY_EXISTS = "The product already exists"
const PRODUCT_SOLD = "Product already sold"
const EMPTY_PRODUCT_STOCK = "Product stock is empty"
const LOW_PRODUCT_STOCK = "Product stock cannot satisfy the requested quantity"
const INVALID_DATE = "Invalid date"
const INVALID_GROUPING = "Invalid grouping criteria"
const INVALID_CATEGORY = "Category is invalid - it must be one of the following: 'smartphone', 'laptop', 'appliance'"
/**
 * Represents an error that occurs when a product is not found.
 */
class ProductNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_NOT_FOUND
        this.customCode = 404
    }
}

/**
 * Represents an error that occurs when a product id already exists.
 */
class ProductAlreadyExistsError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_ALREADY_EXISTS
        this.customCode = 409
    }
}

/**
 * Represents an error that occurs when a product is already sold.
 */
class ProductSoldError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_SOLD
        this.customCode = 409
    }
}

class EmptyProductStockError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = EMPTY_PRODUCT_STOCK
        this.customCode = 409
    }
}

class LowProductStockError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = LOW_PRODUCT_STOCK
        this.customCode = 409
    }
}
//FATTI IO 

class InvalidDateError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = INVALID_DATE
        this.customCode = 400  
    }

}
class InvalidGroupingError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = INVALID_GROUPING
        this.customCode = 422 
    }

}
class InvalidCategoryError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = INVALID_CATEGORY
        this.customCode = 422 
    }

}
export { InvalidCategoryError, ProductNotFoundError, ProductAlreadyExistsError, ProductSoldError, EmptyProductStockError, LowProductStockError, InvalidDateError , InvalidGroupingError}