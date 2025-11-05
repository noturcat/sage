export type UserType = {
  id: number
  email: string
  name: string
  permissions: { name: string; value: boolean }[]
  first_name: string
  last_name: string
  user_comparison_data: []
  user_title: string
  phone_number: string
  phone_area_code: string
  birth_month: string
  education_level: string
  children_info: string
  content_interest:
  | null
  | 'hongkong'
  | 'mainland'
  | 'overseas'
  | 'parenting'
  | 'leisure'
  | 'tutoring'
  | 'interest_classes'
  other_interest: string
  user_points: string
  age: string
  residential_area: string
  income:
  | '$20,000 以下'
  | '$20,000 - $29,999'
  | '$30,000 - $39,999'
  | '$40,000 - $49,999'
  | '$50,000 - $59,999'
  | '$60,000 - $69,999'
  | '$70,000 - $79,999'
  | '$80,000 - $89,999'
  | '$90,000 - $99,999'
  | '$100,000 及以上'
}
