import { ApiGroup } from '../types/documentation';

export const apiDocumentation: ApiGroup[] = [
  {
    title: 'Authentication',
    endpoints: [
      {
        path: '/auth/sign-up',
        method: 'POST',
        description: 'Create a new user account with email and password.',
        authentication: 'Not Required',
        requiredFields: ['email', 'name', 'password', 'mobile'],
        requestExample: {
          email: 'mayank@example.com',
          name: 'Mayank Kansal',
          password: 'SecurePass@123',
          mobile: '9876543210',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Mayank Kansal User created Successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            email: 'mayank@example.com',
            name: 'Mayank Kansal',
            mobile: '9876543210',
            role: 'user',
            createdAt: '2025-01-31T10:00:00.000Z',
          },
        },
      },
      {
        path: '/auth/login',
        method: 'POST',
        description:
          'Authenticate user with email and password. Sets httpOnly JWT cookie.',
        authentication: 'Not Required',
        requiredFields: ['email', 'password'],
        requestExample: {
          email: 'mayank@example.com',
          password: 'SecurePass@123',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Mayank Kansal user logged in successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            name: 'Mayank Kansal',
            email: 'mayank@example.com',
            role: 'user',
            designation: 'Backend Engineer',
            bio: 'Full stack developer',
          },
        },
      },
      {
        path: '/auth/logout',
        method: 'POST',
        description:
          'Terminate current user session and clear authentication cookie.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'User logged out successfully',
        },
      },
      {
        path: '/auth/check-auth',
        method: 'GET',
        description:
          'Verify if user is authenticated. Returns user data if valid token.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'User authenticated',
          data: {
            _id: '507f1f77bcf86cd799439011',
            name: 'Mayank Kansal',
            email: 'mayank@example.com',
            role: 'user',
          },
        },
      },
      {
        path: '/auth/reset-password',
        method: 'PATCH',
        description:
          'Change password for authenticated users using old password.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['oldPassword', 'newPassword'],
        requestExample: {
          oldPassword: 'SecurePass@123',
          newPassword: 'NewSecurePass@456',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Mayank Kansal user password updated successfully',
        },
      },
      {
        path: '/auth/set-new-password',
        method: 'PATCH',
        description:
          'Set new password using reset token from OTP verification.',
        authentication: 'Not Required (Uses reset token)',
        requiredFields: ['resetToken', 'newPassword'],
        requestExample: {
          resetToken:
            '852074e5c5e70bc364cf2e3ae244ce0e88da4133de1afffd10430f66151d7c6d',
          newPassword: 'NewPassword@789',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Mayank Kansal user password reset successfully',
        },
      },
      {
        path: '/auth/imageKit-access',
        method: 'GET',
        description: 'Get ImageKit authentication parameters for file uploads.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'ImageKit authentication successful',
          data: {
            token: 'imagekit_token_here',
            expire: 1234567890,
            signature: 'signature_here',
            publicKey: 'public_y53Z8llGnJaXruvVBdV2i0Gvc3I=',
          },
        },
      },
      {
        path: '/auth/imagekit-delete',
        method: 'DELETE',
        description: 'Delete a file from ImageKit using file ID.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['fileId'],
        requestExample: {
          fileId: 'imagekit_file_id_here',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'File deleted successfully from ImageKit',
        },
      },
    ],
  },
  {
    title: 'User Management',
    endpoints: [
      {
        path: '/user/profile/:userId',
        method: 'GET',
        description:
          'Get public profile information of a specific user by their ID.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['userId (in URL)'],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'User profile retrieved successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            name: 'Mayank Kansal',
            email: 'mayank@example.com',
            bio: 'Full stack developer passionate about building scalable systems',
            designation: 'Backend Engineer',
            dob: '2000-05-15T00:00:00.000Z',
            age: 24,
            mobile: { countryCode: '+91', number: '9876543210' },
            location: {
              country: 'India',
              state: 'Delhi',
              city: 'New Delhi',
              address: 'Tech Park Building',
            },
            skills: ['Node.js', 'Express.js', 'MongoDB', 'Docker'],
            profilePicture:
              'DevConnect-user-profilePicture.507f1f77bcf86cd799439011.jpg',
            resume: 'DevConnect-user-resume.507f1f77bcf86cd799439011.pdf',
            socialLinks: [
              { platform: 'GitHub', url: 'https://github.com/mayank' },
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/mayank' },
            ],
            education: [
              {
                degree: 'B.Tech Computer Science',
                institution: 'Delhi University',
                startDate: '2020-08-01T00:00:00.000Z',
                endDate: '2024-05-01T00:00:00.000Z',
              },
            ],
            experience: [
              {
                position: 'Backend Developer',
                company: 'Tech Solutions',
                startDate: '2024-06-01T00:00:00.000Z',
                endDate: null,
                description: 'Building REST APIs and microservices',
              },
            ],
            certification: [
              {
                company: 'AWS',
                certificate: 'AWS Solutions Architect',
                issuedBy: 'Amazon Web Services',
                issueDate: '2024-03-20T00:00:00.000Z',
              },
            ],
            createdAt: '2024-12-01T10:00:00.000Z',
          },
        },
      },
      {
        path: '/user/search',
        method: 'GET',
        description:
          'Search for users by name or email. Query parameters required.',
        authentication: 'Not Required',
        requiredFields: ['query (URL parameter)'],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Search results retrieved successfully',
          data: [
            {
              _id: '507f1f77bcf86cd799439011',
              name: 'Mayank Kansal',
              email: 'mayank@example.com',
              designation: 'Backend Engineer',
              profilePicture:
                'DevConnect-user-profilePicture.507f1f77bcf86cd799439011.jpg',
              bio: 'Full stack developer',
            },
            {
              _id: '507f1f77bcf86cd799439012',
              name: 'Mayank Sharma',
              email: 'sharma.mayank@example.com',
              designation: 'Frontend Developer',
              profilePicture:
                'DevConnect-user-profilePicture.507f1f77bcf86cd799439012.jpg',
              bio: 'React specialist',
            },
          ],
        },
      },
      {
        path: '/user/update-user',
        method: 'PATCH',
        description:
          'Update user profile information (multipart/form-data or JSON).',
        authentication: 'Required (JWT Cookie)',
        contentType: 'multipart/form-data or application/json',
        requiredFields: [],
        optionalFields: {
          name: 'Full name (string)',
          mobile: 'Phone with country code (object: {countryCode, number})',
          bio: 'Professional bio (string)',
          dob: 'Date of birth (ISO date string)',
          designation: 'Job title (string)',
          location: 'Address info (object: {country, state, city, address})',
          skills: 'Technical skills (array of strings)',
          socialLinks: 'Social profiles (array: [{platform, url}])',
          education: 'Education history (array of objects)',
          experience: 'Work experience (array of objects)',
          certification: 'Professional certs (array of objects)',
          profilePicture: 'Profile image file (multipart)',
          resume: 'Resume PDF file (multipart)',
        },
        requestExample: {
          name: 'Mayank Kansal',
          bio: 'Backend developer passionate about building scalable APIs ⚡',
          designation: 'Senior Backend Engineer',
          mobile: { countryCode: '+91', number: '9876543210' },
          dob: '2000-05-15T00:00:00.000Z',
          location: {
            country: 'India',
            state: 'Delhi',
            city: 'New Delhi',
            address: 'Tech Park Building',
          },
          skills: ['Node.js', 'Express.js', 'MongoDB', 'Docker', 'Kubernetes'],
          socialLinks: [
            { platform: 'GitHub', url: 'https://github.com/mayank' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/mayank' },
          ],
          education: [
            {
              degree: 'B.Tech Computer Science',
              institution: 'Delhi University',
              startDate: '2020-08-01T00:00:00.000Z',
              endDate: '2024-05-01T00:00:00.000Z',
            },
          ],
          experience: [
            {
              position: 'Backend Developer',
              company: 'Tech Solutions',
              startDate: '2024-06-01T00:00:00.000Z',
              endDate: null,
              description: 'Building REST APIs and microservices',
            },
          ],
          certification: [
            {
              company: 'AWS',
              certificate: 'AWS Solutions Architect',
              issuedBy: 'Amazon Web Services',
              issueDate: '2024-03-20T00:00:00.000Z',
            },
          ],
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Mayank Kansal user updated successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            email: 'mayank@example.com',
            name: 'Mayank Kansal',
            bio: 'Backend developer passionate about building scalable APIs ⚡',
            designation: 'Senior Backend Engineer',
            mobile: { countryCode: '+91', number: '9876543210' },
            dob: '2000-05-15T00:00:00.000Z',
            age: 24,
            location: {
              country: 'India',
              state: 'Delhi',
              city: 'New Delhi',
              address: 'Tech Park Building',
            },
            skills: [
              'Node.js',
              'Express.js',
              'MongoDB',
              'Docker',
              'Kubernetes',
            ],
            socialLinks: [
              { platform: 'GitHub', url: 'https://github.com/mayank' },
              { platform: 'LinkedIn', url: 'https://linkedin.com/in/mayank' },
            ],
            profilePicture:
              'DevConnect-user-profilePicture.507f1f77bcf86cd799439011.jpg',
            resume: 'DevConnect-user-resume.507f1f77bcf86cd799439011.pdf',
            education: [
              {
                degree: 'B.Tech Computer Science',
                institution: 'Delhi University',
                startDate: '2020-08-01T00:00:00.000Z',
                endDate: '2024-05-01T00:00:00.000Z',
              },
            ],
            experience: [
              {
                position: 'Backend Developer',
                company: 'Tech Solutions',
                startDate: '2024-06-01T00:00:00.000Z',
                endDate: null,
                description: 'Building REST APIs and microservices',
              },
            ],
            certification: [
              {
                company: 'AWS',
                certificate: 'AWS Solutions Architect',
                issuedBy: 'Amazon Web Services',
                issueDate: '2024-03-20T00:00:00.000Z',
              },
            ],
            role: 'user',
            createdAt: '2024-12-01T10:00:00.000Z',
            updatedAt: '2025-01-31T15:00:00.000Z',
          },
        },
      },
      {
        path: '/user/delete',
        method: 'DELETE',
        description:
          'Permanently delete user account. Requires confirmation with password.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['email', 'password'],
        requestExample: {
          email: 'mayank@example.com',
          password: 'SecurePass@123',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Mayank Kansal user deleted successfully',
        },
      },
    ],
  },
  {
    title: 'Connections API',
    endpoints: [
      {
        path: '/userconnection/send-connection-request',
        method: 'POST',
        description:
          'Send a connection request to another user by their user ID.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['toUserId'],
        requestExample: {
          toUserId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Connection request sent successfully',
          data: {
            fromUserId: '507f1f77bcf86cd799439011',
            toUserId: '507f1f77bcf86cd799439012',
            status: 'pending',
          },
        },
      },
      {
        path: '/userconnection/suspend-connection-request',
        method: 'DELETE',
        description: 'Cancel a pending connection request you sent.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['toUserId'],
        requestExample: {
          toUserId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Connection request cancelled successfully',
        },
      },
      {
        path: '/userconnection/connection-response',
        method: 'POST',
        description: 'Accept or reject a received connection request.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['fromUserId', 'status'],
        optionalFields: {
          status: 'Values: "accepted" or "rejected"',
        },
        requestExample: {
          fromUserId: '507f1f77bcf86cd799439012',
          status: 'accepted',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Connection request accepted successfully',
          data: {
            fromUserId: '507f1f77bcf86cd799439012',
            toUserId: '507f1f77bcf86cd799439011',
            status: 'accepted',
          },
        },
      },
      {
        path: '/userconnection/delete-connection',
        method: 'DELETE',
        description: 'Delete/unfriend an existing connection.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['connectionUserId'],
        requestExample: {
          connectionUserId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Connection deleted successfully',
        },
      },
      {
        path: '/userconnection/get-connections',
        method: 'GET',
        description: 'Retrieve all connections with optional status filter.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        optionalFields: {
          status:
            'Filter by status: "accepted", "pending", "rejected". Default: all',
        },
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Connections retrieved successfully',
          data: [
            {
              fromUserId: '507f1f77bcf86cd799439011',
              toUserId: '507f1f77bcf86cd799439012',
              status: 'accepted',
              createdAt: '2025-01-15T10:00:00.000Z',
            },
            {
              fromUserId: '507f1f77bcf86cd799439013',
              toUserId: '507f1f77bcf86cd799439011',
              status: 'pending',
              createdAt: '2025-01-25T10:00:00.000Z',
            },
          ],
        },
      },
      {
        path: '/userconnection/find-connection',
        method: 'GET',
        description: 'Find connection status with a specific user.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['otherUserId (query parameter)'],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Connection found',
          data: {
            fromUserId: '507f1f77bcf86cd799439011',
            toUserId: '507f1f77bcf86cd799439012',
            status: 'accepted',
          },
        },
      },
      {
        path: '/userconnection/block-user',
        method: 'POST',
        description:
          'Block a user to prevent connection requests and interactions.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['userId'],
        requestExample: {
          userId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'User blocked successfully',
        },
      },
      {
        path: '/userconnection/unblock-user',
        method: 'POST',
        description: 'Unblock a previously blocked user.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['userId'],
        requestExample: {
          userId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'User unblocked successfully',
        },
      },
      {
        path: '/userconnection/ignore-user',
        method: 'POST',
        description:
          'Ignore a user to hide their connection requests and updates.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['userId'],
        requestExample: {
          userId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'User ignored successfully',
        },
      },
      {
        path: '/userconnection/unignore-user',
        method: 'POST',
        description: 'Stop ignoring a user.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['userId'],
        requestExample: {
          userId: '507f1f77bcf86cd799439012',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'User unignored successfully',
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
        description: 'Send OTP to email for password recovery or verification.',
        authentication: 'Not Required',
        requiredFields: ['email'],
        requestExample: {
          email: 'mayank@example.com',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'OTP sent successfully to mayank@example.com',
        },
      },
      {
        path: '/otp/verify-otp',
        method: 'POST',
        description: 'Verify OTP and receive reset token for password reset.',
        authentication: 'Not Required',
        requiredFields: ['email', 'otp'],
        requestExample: {
          email: 'mayank@example.com',
          otp: '123456',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message:
            'OTP verified successfully. Use the provided token to set a new password.',
          data: {
            token:
              '4a62cfb1dcce6447c75fd810d6314b4ec620d392cc3353f21263479a347bd2d8',
            contact: 'mayank@example.com',
          },
        },
      },
    ],
  },
  {
    title: 'Blogs & Content',
    endpoints: [
      {
        path: '/blog/create-blog',
        method: 'POST',
        description: 'Create a new blog post (multipart/form-data for images).',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['title', 'content'],
        optionalFields: {
          image: 'Blog cover image file',
          tags: 'Array of blog tags',
        },
        requestExample: {
          title: 'Getting Started with Node.js',
          content: 'Complete guide to Node.js framework...',
          tags: ['nodejs', 'backend', 'tutorial'],
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Blog created successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Getting Started with Node.js',
            content: 'Complete guide to Node.js framework...',
            author: '507f1f77bcf86cd799439011',
            image: 'DevConnect-blog-image.507f1f77bcf86cd799439011.jpg',
            tags: ['nodejs', 'backend', 'tutorial'],
            createdAt: '2025-01-31T10:00:00.000Z',
            likes: 0,
            comments: 0,
          },
        },
      },
      {
        path: '/blog/get-blogs',
        method: 'GET',
        description: 'Retrieve all blogs with pagination and filtering.',
        authentication: 'Not Required',
        requiredFields: [],
        optionalFields: {
          page: 'Page number (default: 1)',
          limit: 'Blogs per page (default: 10)',
          userId: 'Filter by author ID',
          tags: 'Filter by tags',
        },
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Blogs retrieved successfully',
          data: [
            {
              _id: '507f1f77bcf86cd799439011',
              title: 'Getting Started with Node.js',
              content: 'Complete guide to Node.js framework...',
              author: {
                _id: '507f1f77bcf86cd799439011',
                name: 'Mayank Kansal',
                profilePicture:
                  'DevConnect-user-profilePicture.507f1f77bcf86cd799439011.jpg',
              },
              image: 'DevConnect-blog-image.507f1f77bcf86cd799439011.jpg',
              tags: ['nodejs', 'backend', 'tutorial'],
              createdAt: '2025-01-31T10:00:00.000Z',
              likes: 15,
              comments: 3,
            },
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 50,
            pages: 5,
          },
        },
      },
      {
        path: '/blog/react-blog',
        method: 'POST',
        description: 'Add reaction (like/unlike) to a blog post.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['blogId', 'reaction'],
        optionalFields: {
          reaction: 'Values: "like" or "unlike"',
        },
        requestExample: {
          blogId: '507f1f77bcf86cd799439011',
          reaction: 'like',
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Blog liked successfully',
          data: {
            blogId: '507f1f77bcf86cd799439011',
            reaction: 'like',
            totalLikes: 16,
          },
        },
      },
      {
        path: '/blog/edit-blog/:blogId',
        method: 'PATCH',
        description: 'Edit an existing blog post (only by author).',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        optionalFields: {
          title: 'Blog title',
          content: 'Blog content',
          tags: 'Array of tags',
          image: 'New blog image file',
        },
        requestExample: {
          title: 'Getting Started with Node.js - Updated',
          content: 'Updated complete guide...',
          tags: ['nodejs', 'backend', 'advanced-tutorial'],
        },
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Blog updated successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            title: 'Getting Started with Node.js - Updated',
            content: 'Updated complete guide...',
            tags: ['nodejs', 'backend', 'advanced-tutorial'],
            updatedAt: '2025-01-31T14:00:00.000Z',
          },
        },
      },
      {
        path: '/blog/delete-blog/:blogId',
        method: 'DELETE',
        description: 'Delete a blog post (only by author).',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Blog deleted successfully',
        },
      },
    ],
  },
  {
    title: 'Messaging',
    endpoints: [
      {
        path: '/message/send-message',
        method: 'POST',
        description: 'Send a message to a connected user.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['recipientId', 'message'],
        requestExample: {
          recipientId: '507f1f77bcf86cd799439012',
          message: 'Hey! How are you?',
        },
        responseExample: {
          responseCode: 201,
          status: 'success',
          message: 'Message sent successfully',
          data: {
            _id: '507f1f77bcf86cd799439011',
            sender: '507f1f77bcf86cd799439011',
            recipient: '507f1f77bcf86cd799439012',
            message: 'Hey! How are you?',
            timestamp: '2025-01-31T15:00:00.000Z',
            read: false,
          },
        },
      },
      {
        path: '/message/get-conversation-messages',
        method: 'GET',
        description: 'Retrieve messages between current user and another user.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: ['otherUserId (query parameter)'],
        optionalFields: {
          limit: 'Number of messages to fetch (default: 50)',
          skip: 'Messages to skip for pagination (default: 0)',
        },
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Messages retrieved successfully',
          data: [
            {
              _id: '507f1f77bcf86cd799439011',
              sender: '507f1f77bcf86cd799439011',
              recipient: '507f1f77bcf86cd799439012',
              message: 'Hey! How are you?',
              timestamp: '2025-01-31T15:00:00.000Z',
              read: true,
            },
            {
              _id: '507f1f77bcf86cd799439012',
              sender: '507f1f77bcf86cd799439012',
              recipient: '507f1f77bcf86cd799439011',
              message: 'I am good! How about you?',
              timestamp: '2025-01-31T15:01:00.000Z',
              read: true,
            },
          ],
        },
      },
      {
        path: '/message/get-users-for-slider',
        method: 'GET',
        description:
          'Get list of users to display in chat sidebar with recent messages.',
        authentication: 'Required (JWT Cookie)',
        requiredFields: [],
        requestExample: null,
        responseExample: {
          responseCode: 200,
          status: 'success',
          message: 'Users retrieved successfully',
          data: [
            {
              userId: '507f1f77bcf86cd799439012',
              name: 'Mayank Sharma',
              profilePicture:
                'DevConnect-user-profilePicture.507f1f77bcf86cd799439012.jpg',
              lastMessage: 'I am good! How about you?',
              lastMessageTime: '2025-01-31T15:01:00.000Z',
              unreadCount: 2,
            },
            {
              userId: '507f1f77bcf86cd799439013',
              name: 'Priya Singh',
              profilePicture:
                'DevConnect-user-profilePicture.507f1f77bcf86cd799439013.jpg',
              lastMessage: 'See you tomorrow!',
              lastMessageTime: '2025-01-30T18:00:00.000Z',
              unreadCount: 0,
            },
          ],
        },
      },
    ],
  },
];
