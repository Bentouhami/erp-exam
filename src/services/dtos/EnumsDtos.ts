// path: src/services/dtos/EnumsDtos.ts

// Enums matching the database schema
export enum RoleDTO {
    CUSTOMER = 'CUSTOMER',
    ADMIN = 'ADMIN',
    ACCOUNTANT = 'ACCOUNTANT',
    SUPER_ADMIN = 'SUPER_ADMIN',
}


export enum AddressTypeDTO {
    HOME = 'HOME',
    OFFICE = 'OFFICE',
    BILLING = 'BILLING',
    SHIPPING = 'SHIPPING'
}

export enum MovementTypeDTO {
    PURCHASE = 'PURCHASE',
    SALE = 'SALE',
    RETURN = 'RETURN',
    TRANSFER = 'TRANSFER',
    ADJUSTMENT = 'ADJUSTMENT'
}

export enum TokenTypeDTO {
    PASSWORD_RESET = 'PASSWORD_RESET',
    EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
    TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH'
}

export enum UtaxTypeDTO {
    LUXURY = 'LUXURY',
    BASIC = 'BASIC',
    SPECIAL = 'SPECIAL'
}

export enum PaymentModeDTO {
    CASH = 'CASH',
    CREDIT_CARD = 'CREDIT_CARD',
    BANK_TRANSFER = 'BANK_TRANSFER',
    PAYPAL = 'PAYPAL'
}

export enum PaymentStatusDTO {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED'
}

export enum VatTypeDTO {
    REDUCED = 'REDUCED',
    STANDARD = 'STANDARD',
    EXEMPT = 'EXEMPT'
}

export enum ItemTypeDTO {
    PHYSICAL = 'PHYSICAL',
    DIGITAL = 'DIGITAL'
}

export enum ItemStatusDTO {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
}
