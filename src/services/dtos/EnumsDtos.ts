// path: src/services/dtos/EnumsDtos.ts

// Enums matching the database schema
export enum Roles {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    ACCOUNTANT = 'ACCOUNTANT',
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
    SALES_REP = 'SALES_REP',
    SUPPORT_AGENT = 'SUPPORT_AGENT',
    SUPER_ADMIN = 'SUPER_ADMIN',
}


export enum AddressType {
    HOME = 'HOME',
    OFFICE = 'OFFICE',
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING'
}

export enum MovementType {
    PURCHASE = 'PURCHASE',
    SALE = 'SALE',
    RETURN = 'RETURN',
    TRANSFER = 'TRANSFER',
    ADJUSTMENT = 'ADJUSTMENT'
}

export enum TokenType {
    PASSWORD_RESET = 'PASSWORD_RESET',
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH'
}

export enum UtaxType {
    LUXURY = 'LUXURY',
    BASIC = 'BASIC',
    SPECIAL = 'SPECIAL'
}

export enum PaymentMode {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    PAYPAL = 'PAYPAL'
}

export enum PaymentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

export enum VatType {
    REDUCED = 'REDUCED',
    STANDARD = 'STANDARD',
    EXEMPT = 'EXEMPT'
}

export enum ItemType {
    PHYSICAL = 'PHYSICAL',
    DIGITAL = 'DIGITAL'
}

export enum ItemStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}
