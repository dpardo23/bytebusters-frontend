export interface UserAccount {
  userId: number
  email: string
  userType: string
  firstName: string
  lastName: string
  fullName: string
  professionalTitle: string
  username: string
  countryId: string
  authProvider: string
  createdAt: string
  companyName?: string
  industry?: string
  companySize?: number
  websiteUrl?: string
  nit?: number
  contactFirstName?: string
  contactLastName?: string
}
