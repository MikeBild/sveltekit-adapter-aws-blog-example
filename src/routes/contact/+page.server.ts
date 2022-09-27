import type { Actions } from './$types';
import { invalid } from '@sveltejs/kit';
import { SESV2 } from 'aws-sdk';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email');
    const message = form.get('message');

    if (!(email && message)) return invalid(400, { email, message, missing: true });

    await new SESV2()
      .sendEmail({
        FromEmailAddress: 'mike@mikebild.com',
        Destination: { ToAddresses: ['mike@mikebild.com'] },
        Content: {
          Simple: {
            Subject: { Data: `Message from Blog ${email}` },
            Body: { Text: { Data: `Message: ${message}` } }
          }
        }
      })
      .promise();

    return { success: true };
  }
};
