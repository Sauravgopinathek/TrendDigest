export interface EmailDigest {
  to: string;
  subject: string;
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences: {
    categories: string[];
    frequency: 'daily' | 'weekly' | 'custom';
    time: string;
  };
}

class EmailService {
  private users: User[] = [
    {
      id: '1',
      email: 'founder@startup.com',
      name: 'John Doe',
      preferences: {
        categories: ['technology', 'business'],
        frequency: 'daily',
        time: '07:00'
      }
    },
    {
      id: '2',
      email: 'pm@company.com',
      name: 'Jane Smith',
      preferences: {
        categories: ['technology', 'business', 'environment'],
        frequency: 'daily',
        time: '08:00'
      }
    }
  ];

  async sendDigestEmail(user: User, content: string): Promise<boolean> {
    // In production, integrate with Gmail API or email service like SendGrid
    // For demo, we'll simulate the email sending process
    
    const emailDigest: EmailDigest = {
      to: user.email,
      subject: `Your Daily Market Trends Digest - ${new Date().toLocaleDateString()}`,
      content: this.formatEmailContent(content, user.name),
      timestamp: new Date()
    };

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Log the email for demonstration
    console.log('📧 Email sent:', emailDigest);
    
    // In production, replace with actual Gmail API call:
    // const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    // const message = this.createGmailMessage(emailDigest);
    // await gmail.users.messages.send({
    //   userId: 'me',
    //   requestBody: { raw: message }
    // });

    return true;
  }

  async sendDigestToAllUsers(content: string): Promise<{ sent: number; failed: number }> {
    let sent = 0;
    let failed = 0;

    for (const user of this.users) {
      try {
        await this.sendDigestEmail(user, content);
        sent++;
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        failed++;
      }
    }

    return { sent, failed };
  }

  async scheduleDigest(content: string): Promise<string> {
    // Simulate scheduling the digest for all users
    const result = await this.sendDigestToAllUsers(content);
    
    return `📧 Digest scheduled and sent to ${result.sent} users. ${result.failed > 0 ? `${result.failed} failed.` : ''}`;
  }

  getUsers(): User[] {
    return this.users;
  }

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      ...user,
      id: Date.now().toString()
    };
    this.users.push(newUser);
    return newUser;
  }

  private formatEmailContent(content: string, userName: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .footer { background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666; }
        .trend-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; }
        .cta-button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 TrendDigest</h1>
        <p>Your Daily Market Intelligence</p>
    </div>
    
    <div class="content">
        <h2>Hi ${userName}!</h2>
        <p>Here's your personalized market trends digest for ${new Date().toLocaleDateString()}:</p>
        
        <div class="trend-item">
            ${content.replace(/\n/g, '<br>')}
        </div>
        
        <a href="https://trenddigest.app/dashboard" class="cta-button">View Full Dashboard</a>
        
        <p>Want to customize your digest? <a href="https://trenddigest.app/settings">Update your preferences</a></p>
    </div>
    
    <div class="footer">
        <p>You're receiving this because you subscribed to TrendDigest. <a href="#">Unsubscribe</a></p>
        <p>© 2024 TrendDigest. All rights reserved.</p>
    </div>
</body>
</html>`;
  }

  private createGmailMessage(emailDigest: EmailDigest): string {
    // Create RFC 2822 formatted message for Gmail API
    const message = [
      `To: ${emailDigest.to}`,
      `Subject: ${emailDigest.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      emailDigest.content
    ].join('\n');

    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

export const emailService = new EmailService();