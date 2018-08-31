import { UserModel } from '../../models/User';

export const forgottenPasswordMailTemplate = (user: UserModel) => ({
  subject: 'Timefly - Password reset request',
  text: `
Hi ${user.firstname},

You are receiving this message because you have requested resetting your password on the Timefly site.
Please, follow this link to create a new password:

Reset password

If you have not requested resetting your password, you can just delete this email.

Thank you for using our services,
Timefly Team
  `,
  html: `
<h3>Hi ${user.firstname},</h3>

<p>You are receiving this message because you have requested resetting your password on the Timefly site.<br/>
Please, follow this link to create a new password:</p>

<a href="http://timefly.com/reset-password" target="_blank">Reset password</a>

<p>If you have not requested resetting your password, you can just delete this email.</p>

Thank you for using our services, <br/>
<strong>Timefly Team</strong>
`,
});
