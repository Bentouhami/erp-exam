// Path: src/services/dtos/AddressDtos.ts

/** Base interfaces for common fields */
interface BaseDTO {
    createdAt?: Date;
    updatedAt?: Date;
}

/** Country DTO */
export interface CountryDTO extends BaseDTO {
    id?: number;
    countryCode?: string;
    name: string;
}

export interface CreateCountryDTO {
    countryCode: string;
    name: string;
}

export interface UpdateCountryDTO {
    countryCode?: string;
    name?: string;
}

/** City DTO */
export interface CityDTO extends BaseDTO {
    id?: number;
    cityCode: string;
    name: string;
    countryId: number;
    country?: CountryDTO;
}

export interface CreateCityDTO {
    cityCode: string;
    name: string;
    countryId: number;
}

export interface UpdateCityDTO {
    cityCode?: string;
    name?: string;
    countryId?: number;
}

/** Address Type DTO */
export interface AddressTypeDTO extends BaseDTO {
    id?: number;
    name: string;
}

export interface CreateAddressTypeDTO {
    name: string;
}

export interface UpdateAddressTypeDTO {
    name?: string;
}

/** Address DTO */
export interface AddressDTO extends BaseDTO {
    id?: number;
    street: string;
    complement?: string;
    streetNumber?: string;
    boxNumber?: string;
    cityId: number;
    city?: CityDTO;
}

export interface CreateAddressDTO {
    street: string;
    complement?: string;
    streetNumber?: string;
    boxNumber?: string;
    cityId: number;
}

export interface UpdateAddressDTO {
    street?: string;
    complement?: string;
    streetNumber?: string;
    boxNumber?: string;
    cityId?: number;
}

/** User Address DTO */
export interface UserAddressDTO extends BaseDTO {
    id?: number;
    userId: string;
    addressId: number;
    addressTypeId: number;
    address?: AddressDTO;
    addressType?: AddressTypeDTO;

}

export interface CreateUserAddressDTO {
    userId: string;
    addressId: number;
    addressTypeId: number;
}

export interface UpdateUserAddressDTO {
    addressTypeId?: number;
}

/** Response DTOs for nested data */
export interface AddressWithDetailsDTO extends AddressDTO {
    city: CityDTO & {
        country: CountryDTO;
    };
}

export interface UserAddressWithDetailsDTO extends UserAddressDTO {
    address: AddressWithDetailsDTO;
    addressType: AddressTypeDTO;
}

/** Collection Response DTOs */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export interface AddressCollectionDTO extends PaginatedResponse<AddressDTO> {}
export interface UserAddressCollectionDTO extends PaginatedResponse<UserAddressDTO> {}
export interface CityCollectionDTO extends PaginatedResponse<CityDTO> {}
export interface CountryCollectionDTO extends PaginatedResponse<CountryDTO> {}
export interface AddressTypeCollectionDTO extends PaginatedResponse<AddressTypeDTO> {}