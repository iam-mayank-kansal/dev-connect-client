import { ApiGroup } from '../types/documentation';

export const apiDocumentation: ApiGroup[] = [
  {
    title: 'Authentication',
    endpoints: [
      {
        path: '/auth/sign-up',
        method: 'POST',
        description: 'Create a new user account.',
        authentication: 'Not Required',
        requiredFields: ['email', 'name', 'password', 'mobile'],
        requestExample: {
          email: 'kartikwork@gmail.com',
          name: 'Kartik Bhatt',
          password: 'Kartik@12345',
          mobile: '9310204975',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartik Bhatt User created Successfully',
          data: {
            email: 'kartikwork@gmail.com',
            password:
              '$2b$10$p/1iXs7UZk5NAQHwsw/Ev.WU8wGfMieOU7QcqVIvjB65Vf6pc7Y4i',
            name: 'Kartik Bhatt',
          },
        },
      },
      {
        path: '/auth/login',
        method: 'POST',
        description: 'Authenticate an existing user.',
        authentication: 'Not Required',
        requiredFields: ['email', 'password'],
        requestExample: {
          email: 'kartikwork@gmail.com',
          password: 'Kartik@12345',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartik Bhatt user logged in successfully',
          data: {
            _id: '68ba9038aeeb2a6467e6be76',
            name: 'Kartik Bhatt',
            email: 'kartikwork@gmail.com',
          },
        },
      },
      {
        path: '/auth/logout',
        method: 'POST',
        description: 'Terminate the current user session.',
        authentication: 'Required (JWT)',
        requestExample: null,
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'user logged out successfully',
        },
      },
    ],
  },
  {
    title: 'User Management',
    endpoints: [
      {
        path: '/user/delete',
        method: 'DELETE',
        description: 'Permanently delete a user account.',
        authentication: 'Required',
        requiredFields: ['email', 'password'],
        requestExample: {
          email: 'kartikwork@gmail.com',
          password: 'Kartik@12345',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartik Bhatt user deleted successfully',
        },
      },
      {
        path: '/user/reset-password',
        method: 'PATCH',
        description: 'Change password for authenticated users.',
        authentication: 'Required',
        requiredFields: ['oldpassword', 'newpassword'],
        requestExample: {
          oldpassword: 'Kartik@12345',
          newpassword: 'Raj@1234567new',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartik Bhatt user password updated successfully',
        },
      },
      {
        path: '/user/set-new-password',
        method: 'PATCH',
        description:
          'Set a new password using reset token from OTP verification.',
        authentication: 'Not Required',
        requiredFields: ['resetToken', 'newPassword'],
        requestExample: {
          resetToken:
            '852074e5c5e70bc364cf2e3ae244ce0e88da4133de1afffd10430f66151d7c6d',
          newPassword: 'Mayank@123',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartik Bhatt user password reseted successfully',
        },
      },
      {
        path: '/user/update-user',
        method: 'PATCH',
        description: 'Update user profile information and upload files.',
        authentication: 'Required',
        contentType: 'multipart/form-data or application/json',
        optionalFields: {
          name: 'Full name',
          mobile: 'Phone number with country code',
          bio: 'Professional bio',
          dob: 'Date of birth',
          designation: 'Job title',
          profilePicture: 'Profile image file',
          location: 'Address information',
          socialLinks: 'GitHub, LinkedIn profiles',
          skills: 'Technical skills array',
          education: 'Educational background',
          experience: 'Work experience',
          resume: 'Resume file upload',
          certification: 'Professional certifications',
        },
        requestExample: {
          name: 'Kartikey Bhatt',
          mobile: {
            countryCode: '+91',
            number: '9123456789',
          },
          bio: 'Backend developer passionate about building scalable APIs ⚡',
          dob: '2003-05-06T00:00:00.000Z',
          designation: 'Backend Engineer',
          location: {
            country: 'India',
            state: 'Uttarakhand',
            city: 'Dehradun',
            address: '45 IT Park Road',
          },
          socialLinks: [
            { platform: 'GitHub', url: 'https://github.com/kartikeybhatt' },
            {
              platform: 'LinkedIn',
              url: 'https://linkedin.com/in/kartikeybhatt',
            },
          ],
          skills: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Kubernetes'],
          education: [
            {
              degree: 'B.Sc Computer Science',
              institution: 'Delhi University',
              startDate: '2020-08-01T00:00:00.000Z',
              endDate: '2023-05-01T00:00:00.000Z',
            },
          ],
          experience: [
            {
              position: 'Backend Developer Intern',
              company: 'TechNova Solutions',
              startDate: '2023-06-01T00:00:00.000Z',
              endDate: '2024-03-01T00:00:00.000Z',
              description:
                'Worked on REST APIs, authentication, and containerized services using Docker.',
            },
          ],
          certification: [
            {
              company: 'Google',
              certificate: 'Google Cloud Associate Engineer',
              issuedBy: 'Google',
              issueDate: '2022-07-15T00:00:00.000Z',
            },
            {
              company: 'Linux Foundation',
              certificate: 'Certified Kubernetes Administrator (CKA)',
              issuedBy: 'CNCF',
              issueDate: '2024-02-20T00:00:00.000Z',
            },
          ],
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Kartikey Bhatt user updated successfully',
          data: {
            mobile: { countryCode: '+91', number: '9123456789' },
            location: {
              country: 'India',
              state: 'Uttarakhand',
              city: 'Dehradun',
              address: '45 IT Park Road',
            },
            _id: '68bb294a15f5f4ef346dce71',
            email: 'kartikwork@gmail.com',
            password:
              '$2b$10$1XaoEp/AUVc3VznriDTB..JaTsKhk8hryCuAJUtRTeYP/T64KPgCm',
            name: 'Kartikey Bhatt',
            bio: 'Backend developer passionate about building scalable APIs ⚡',
            skills: [
              'Node.js',
              'Express.js',
              'MongoDB',
              'Docker',
              'Kubernetes',
            ],
            role: 'user',
            education: [
              {
                degree: 'B.Sc Computer Science',
                institution: 'Delhi University',
                startDate: '2020-08-01T00:00:00.000Z',
                endDate: '2023-05-01T00:00:00.000Z',
              },
            ],
            experience: [
              {
                position: 'Backend Developer Intern',
                company: 'TechNova Solutions',
                startDate: '2023-06-01T00:00:00.000Z',
                endDate: '2024-03-01T00:00:00.000Z',
                description:
                  'Worked on REST APIs, authentication, and containerized services using Docker.',
              },
            ],
            certification: [
              {
                company: 'Google',
                certificate: 'Google Cloud Associate Engineer',
                issuedBy: 'Google',
                issueDate: '2022-07-15T00:00:00.000Z',
              },
              {
                company: 'Linux Foundation',
                certificate: 'Certified Kubernetes Administrator (CKA)',
                issuedBy: 'CNCF',
                issueDate: '2024-02-20T00:00:00.000Z',
              },
            ],
            socialLinks: [
              { platform: 'GitHub', url: 'https://github.com/kartikeybhatt' },
              {
                platform: 'LinkedIn',
                url: 'https://linkedin.com/in/kartikeybhatt',
              },
            ],
            createdAt: '2025-09-05T18:17:46.017Z',
            updatedAt: '2025-09-05T18:19:10.630Z',
            __v: 0,
            age: 22,
            designation: 'Backend Engineer',
            dob: '2003-05-06T00:00:00.000Z',
            profilePicture:
              'DevConnect-user-profilePicture.68bb294a15f5f4ef346dce71.jpg',
            resume: 'DevConnect-user-resume.68bb294a15f5f4ef346dce71.pdf',
          },
        },
      },
    ],
  },
  {
    title: 'Utility Services',
    endpoints: [
      {
        path: '/otp/send-otp',
        method: 'POST',
        description:
          "Send verification code to user's email for password recovery.",
        authentication: 'Not Required',
        requiredFields: ['email'],
        requestExample: {
          email: 'kartikwork@gmail.com',
        },
        responseExample: {
          responseCode: '200',
          status: 'success',
          message: 'OTP sent successfully to kartikwork@gmail.com',
        },
      },
      {
        path: '/otp/verify-otp',
        method: 'POST',
        description: 'Verify the OTP and receive reset token.',
        authentication: 'Not Required',
        requiredFields: ['email', 'otp'],
        requestExample: {
          email: 'kartikwork@gmail.com',
          otp: '919246',
        },
        responseExample: {
          status: 200,
          message:
            'OTP verified successfully. Use the provided token to set a new password.',
          data: {
            token:
              '4a62cfb1dcce6447c75fd810d6314b4ec620d392cc3353f21263479a347bd2d8',
            contact: 'kartikwork@gmail.com',
          },
        },
      },
    ],
  },
  {
    title: 'Connections API',
    endpoints: [
      {
        path: '/list-connections',
        method: 'POST',
        description: 'Retrieve connections based on their status.',
        authentication: 'Bearer Token',
        contentType: 'application/json',
        requiredFields: [],
        optionalFields: {
          status:
            'Filter connections by status. Values: `accepted`, `rejected`, `pending`, `blocked`. Default: `pending`',
        },
        requestExample: {
          status: 'accepted',
        },
        responseExample: {
          success: true,
          connections: [
            {
              toUserId: '507f1f77bcf86cd799439011',
              fromUserId: '507f191e810c19729de860ea',
              status: 'accepted',
            },
            {
              toUserId: '507f1f77bcf86cd799439012',
              fromUserId: '507f191e810c19729de860eb',
              status: 'accepted',
            },
          ],
        },
      },
      {
        path: '/send-connection-request',
        method: 'POST',
        description:
          'Send a connection request to another user by their username.',
        authentication: 'Bearer Token',
        contentType: 'application/json',
        requiredFields: ['toUserName'],
        optionalFields: {},
        requestExample: {
          toUserName: 'john_doe',
        },
        responseExample: {
          success: true,
          message: 'Connection request sent to john_doe',
        },
      },
      {
        path: '/received-connection-request',
        method: 'POST',
        description: 'Accept, reject, or block a received connection request.',
        authentication: 'Bearer Token',
        contentType: 'application/json',
        requiredFields: ['fromUserName', 'action'],
        optionalFields: {},
        requestExample: {
          fromUserName: 'jane_doe',
          action: 'accepted',
        },
        responseExample: {
          success: true,
          message: "You have accepted jane_doe's request",
        },
      },
      {
        path: '/block-connection',
        method: 'POST',
        description: 'Block a user to prevent any future connection requests.',
        authentication: 'Bearer Token',
        contentType: 'application/json',
        requiredFields: ['userName'],
        optionalFields: {},
        requestExample: {
          userName: 'spam_account',
        },
        responseExample: {
          success: true,
          message: 'User spam_account has been blocked',
        },
      },
    ],
  },
];
