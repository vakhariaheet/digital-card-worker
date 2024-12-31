
export interface EmailProp {
    name: string,
    email: string,
    mobile?: string,
    message?: string
    subject?: string
}

export interface ENVs {
    SENDGRID_KEY: unknown,
    SENDGRID_TEMPLATE_ID: unknown,
    FROM: unknown
    TO: unknown
}

// Send email using sendgrid

export const sendEmail = async (emailProp: EmailProp, env: ENVs) => {
   
    const msg = {
        personalizations: [
            {
                to: [
                    {
                        email: env.TO as string,
                        name:'Webbound Notifications'
                    },
                ],
               
                dynamic_template_data: {
                    name: emailProp.name,
                    email: emailProp.email,
                    mobile: emailProp.mobile,
                    message: emailProp.message
                }
            }
        ],
        subject:  'New message from portfolio',
        from: {
            email: env.FROM as string,
            name: 'Webbound Notifications',
            subject: 'New message from portfolio2'

        },
        template_id: env.SENDGRID_TEMPLATE_ID as string
    };
    try {
        const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.SENDGRID_KEY}`
            },
            body: JSON.stringify({ ...msg })
        });
        console.log(resp);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}