// prefix: /api
const path = {
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  VERIFY_TOKEN: '/suth/verify-token',
  VERIFY_EMAIL: '/auth/verify-email/:id',
  SEND_EMAIL_VERIFICATION: '/auth/send-email-verification',
  CHANGE_PASSWORD: '/auth/change-password',
  RESET_PASSWORD: '/auth/reset-password'
}

export default path