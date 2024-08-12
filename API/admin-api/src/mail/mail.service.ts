import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { config } from 'dotenv';
config();

@Injectable()
export class MailService {
  data = [
    {
      filename: 'image.jpg',
      type: 'image/png',
      content:
        // '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',
      content_id: 'myimagecid',
      disposition: 'inline',
    },
  ];

  html1 = `
  <!doctype html>
<html lang="en">
   <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <title></title>
   </head>
   <body>
      <table style="border:1px solid #C5D93B; background-color: #fff;box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;padding: 20px;margin: auto; width: 650px;border-radius:8px;border-top:6px solid #C5D93B;">
         <tr>
            <td></td>
         </tr>
         <tr>
           <td colspan="7" height="50px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif; " align="center"><img  style="width: 200px;" src="cid:myimagecid"></td>
         </tr>`;

  html2 = `<tr>
    <td colspan="7" >   
        <h4 style="color: #868686;font-weight: 600;font-size: 17px;font-family: Arial, sans-serif;"> By Team Tuitionflex</h4>  
    </td>
  </tr>

</table>
</body>

</html>`;
  constructor(@InjectSendGrid() private readonly client: SendGridService) {}

  async inviteEmail(Email, password, url) {
    const body =
      'Email:' +
      Email +
      '\nPassword:' +
      password +
      '\nVerify To Your Email:' +
      url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Invite Link',
        text: body,
        attachments: this.data,
        html:
          // this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Invite Link
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Email : ${Email}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Password : ${password}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${url}">Click here to verify your email</a>
             </p>   
             
              </td>
         </tr>
            ` + this.html2,
      });
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
async invitestudent(Email,url){
  console.log("Hello")
  console.log(Email)
  const body =
  'Email:' +
  Email +
  url;
  try {
    await this.client.send({
      to: Email,
      from: process.env.FromMail,
      subject: process.env.title1 + ' Invite Link',
      text: body,
      attachments: this.data,
      html:
        // this.html1 +
        `    
        <tr>
         <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
         Invite Link
         </td>
       </tr>
       <tr>
         
           <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
           Email : ${Email}
           </p> 
          
           <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
           <a href="${url}">Click here to verify your email</a>
           </p>   
           
            </td>
       </tr>
          ` + this.html2,
    });
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
  async add(Email, password, url) {
    const body =
      'Email:' +
      Email +
      '\nPassword:' +
      password +
      '\nVerify To Your Email:' +
      url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Login Details',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Login Details
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Email : ${Email}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Password : ${password}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${url}">Click here to verify your email</a>
             </p>   
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
  async cosignerWelcome(
    email,
    firstName,
    middleName,
    lastName,
    CosignerfirstName,
    schoolName,
    link,
    content,
  ) {
    try {
      if(middleName==null)
      {
        middleName=' '
      }
      const body = `
      <h2>Tuitionflex</h2>
       <p>Dear ${CosignerfirstName},</p>
    
    <p>${firstName} ${middleName} ${lastName} has requested you to co-sign ${firstName}'s tuition credit
    plan to attend ${schoolName}. We require you to provide additional information in order to complete the application.
    To do so, please click on the link below and you will be directed to our online web portal. If you have not already done
    so, you will need to register before you can login and complete your portion of the application.</p>
   

<a href="${link}">${content}</a>

<p>If you have any questions, please do not hesitate to call us at the number provided below.</p>
<p>Thank you,</p>

<span>TuitionFlex Customer Service</span><br>
<span>Education Loan Source</span><br>
<span>spanhone: 866-758-7123</span><br>


<span>Toll free fax: 858-720-6890</span><br>
<span>customerservice@tuitionflex.com</span><br>
             
      `;
      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: `Tuitionflex verify cosigner`,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Tuitionflex
           </td>
         </tr>
         
           
           <p>Dear ${CosignerfirstName},</p>
    
    <p>${firstName} ${middleName} ${lastName} has requested you to co-sign ${firstName}'s tuition credit
    plan to attend ${schoolName}. We require you to provide additional information in order to complete the application.
    To do so, please click on the link below and you will be directed to our online web portal. If you have not already done
    so, you will need to register before you can login and complete your portion of the application.</p>
   

<a href="${link}">${content}</a>

<p>If you have any questions, please do not hesitate to call us at the number provided below.</p>
<p>Thank you,</p>

<span>TuitionFlex Customer Service</span><br>
<span>Education Loan Source</span><br>
<span>spanhone: 866-758-7123</span><br>


<span>Toll free fax: 858-720-6890</span><br>
<span><a href="https://www.customerservice@tuitionflex.com">customerservice@tuitionflex.com</a></span><br>
             
              
            ` +
          this.html2,
      });
      console.log('Mail sent to cosigner successfully');
    } catch (error) {
      console.error('Error sending  email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
  async request_bank_login(Email, url) {
    const body = 'Email:' + Email + '\nConnect Your Bank:' + url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Connect Your Bank',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Connect Your Bank
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Email : ${Email}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${url}">Connect Your Bank</a>
             </p>   
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async passwordResetMail(Email, link) {
    try {
      const body =
        'Hi\nYou requested to reset your password.\nPlease, click the link below to reset your password\n';

      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Reset password',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Reset password
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Hi
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             You requested to reset your password.
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Please, click the link below to reset your password
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${link}">Reset Password</a>
             </p>   
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('pw reset sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async sendOtp(email, otp) {
    try {
      const body = `
      <h2>${process.env.title1}</h2>
      <p>To authenticate, please use the following One Time Password(OTP).</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for only 5 min.</p>
      <p>Thank you</p>
      `;
      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Login Auth',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title1}
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             To authenticate, please use the following One Time Password(OTP).
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             ${otp}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             This OTP is valid for only 5 min.
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Thank you
             </p>   
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('Two factor auth email sent successfully');
    } catch (error) {
      console.error('Error sending two factor auth email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async payment(Email, amount, status, TransactionId, milestone, Loan) {
    try {
      const body =
        process.env.title1 +
        ' Milestone Payment\nTransactionId: ' +
        TransactionId +
        '\nAmount : ' +
        amount +
        '\nPayment ' +
        status +
        '\n';
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + ' Milestone Payment',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title1} Payment
           </td>
         </tr>
         <tr>
           
             
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             ${Loan}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">Milestone ${milestone}</p>
            <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">TransactionId: ${TransactionId}</p>
            <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">Amount : $${amount}</p>
            <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">Payment ${status}</p>
                 
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('mail sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async initial_note(Email, url) {
    const body = 'Email:' + Email + '\nSignature to Promissory Note:' + url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: 'Promissory Note',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Promissory Note
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Email : ${Email}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${url}">Click here to sign promissory note</a>
             </p> 
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async admincomments(Email, subject, comment, url) {
    try {
      const body = comment + '\n';
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: subject,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `   
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title1} Message
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             ${comment}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             <a href="${url}">Go to Login</a>
             </p> 
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('mail sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async comments(Email, subject, comment) {
    try {
      const body = comment + '\n';
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: subject,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `   
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title1} Message
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             ${comment}
             </p> 
             
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log('mail sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }

  async inviteSchool(Email, password, url, content) {
    const body =
      'Email:' +
      Email +
      '\nPassword:' +
      password +
      '\nVerify To Your Email:' +
      url;
    try {
      await this.client.send({
        to: Email,
        from: process.env.FromMail,
        subject: process.env.title1 + 'Invite Link',
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           Invite Link
           </td>
         </tr>
         <tr>
           
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Email : ${Email}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">
             Password : ${password}
             </p> 
             <p style="list-style: none;line-height: 30px;font-size: 17px;color:#858399;margin:0px 0px 15px;font-family: Arial, sans-serif;">Click the following link to verify your email:
             <a href="${url}">${content}</a>
             </p>   
             
              </td>
         </tr>
            ` +
          this.html2,
      });
      console.log(process.env.title1);
      console.log('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
  async borrowerEsign(
    email,
    firstName,
    schoolName,
    link,
    academicProgram,
    expireDate,
    content,
  ) {
    try {
      const body = `
      <h2>${process.env.title1}</h2>
       <p>Dear ${firstName},</p>
    
    <p>Congratulations! ${schoolName} has certified your ${academicProgram} application and you are almost
    done with the credit process.
    Please note that ${schoolName} may have certified a contract amount and/or repayment term that is
    different than what you requested, which could impact your monthly payments, so it is important to review your Approval
    Disclosure which will provide the final contract amount and term.</p>
   
    <p>Please click on the link below to login to view your ${academicProgram} account, which will allow you to:
</p>
<ul>
    <li>View your Approval Disclosure which outlines the terms of your tuition credit plan</li>
    <li>View your Risk Based Pricing Notice which contains information regarding your credit score and related information
</li>
    <li>Electronically sign your agreement
</li>
    <li>Submit your application fee, if applicable
</li>
</ul>

<a href="${link}">${content}</a>

<p>PLEASE NOTE: YOU HAVE UNTIL ${expireDate} TO EITHER ACCEPT THE TERMS OF YOUR TUITION
CREDIT PLAN OR CANCEL YOUR APPLICATION. IF YOU DO NOT SIGN YOUR AGREEMENT PRIOR TO THE
DATE LISTED, YOUR APPLICATION WILL BE CANCELLED.</p>
<p>Thank you,</p>
<div >
<span>TuitionFlex Customer Service</span><br>
<span>Education Loan Source</span><br>
<span>Phone: 866-758-7123</span><br>
<span>Toll free fax: 858-720-6890</span><br>
<span><a href ="">customerservice@tuitionflex.com </a></span>
 </div>            
      `;
      await this.client.send({
        to: email,
        from: process.env.FromMail,
        subject: `${process.env.title1} Review Disclosure and Borrower E-sign`,
        text: body,
        attachments: this.data,
        html:
          this.html1 +
          `    
          <tr>
           <td colspan="7" height="70px" style="font-size: 30px;font-weight: 600;margin:2rem 0px;font-family: Arial, sans-serif;">
           ${process.env.title1}
           </td>
         </tr>
         
           
                 <p>Dear <span style ='text-transform:capitalize'>${firstName}<span>,</p>
    
    <p>Congratulations! <strong style = 'text-transform:capitalize'>${schoolName} </strong> has certified your ${academicProgram} application and you are almost
    done with the credit process.
    Please note that <strong style = 'text-transform:capitalize'>${schoolName}</strong>  may have certified a contract amount and/or repayment term that is
    different than what you requested, which could impact your monthly payments, so it is important to review your Approval
    Disclosure which will provide the final contract amount and term.</p>
   
    <p>Please click on the link below to login to view your ${academicProgram} account, which will allow you to:
</p>
<ul>
    <li>View your Approval Disclosure which outlines the terms of your tuition credit plan</li>
    <li>View your Risk Based Pricing Notice which contains information regarding your credit score and related information
</li>
    <li>Electronically sign your agreement
</li>
    <li>Submit your application fee, if applicable
</li>
</ul>

<a href="${link}">${content}</a>

<p>PLEASE NOTE: YOU HAVE UNTIL ${expireDate} TO EITHER ACCEPT THE TERMS OF YOUR TUITION
CREDIT PLAN OR CANCEL YOUR APPLICATION. IF YOU DO NOT SIGN YOUR AGREEMENT PRIOR TO THE
DATE LISTED, YOUR APPLICATION WILL BE CANCELLED.</p>
<p>Thank you,</p>

<span>TuitionFlex Customer Service</span><br>
<span>Education Loan Source</span><br>
<span>Phone: 866-758-7123</span><br>
<span>Toll free fax: 858-720-6890</span><br>
<span><a href ="https://customerservice@tuitionflex.com">customerservice@tuitionflex.com </a></span>
             
              
            ` +
          this.html2,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending Email');
      console.error(error);
      if (error.response) {
        console.error(error.response.body);
      }
    }
  }
}
