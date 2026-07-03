export const UserRolesEnum = {
  CUSTOMER: "customer",
  SELLER: "seller",
  ADMIN: "admin"
}

export const availableUserRoles = Object.values(UserRolesEnum)

export const AddressTypesEnum = {
    CUSTOMER: "customer",
    BUSINESS: "business",
}

export const availableAddressTypes = Object.values(AddressTypesEnum)

export const selletProfileVerificationStatusEnum = {
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected"
}

export const availableSelletProfileVerificationStatus = Object.values(selletProfileVerificationStatusEnum)
