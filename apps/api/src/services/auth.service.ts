import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto, ResetPasswordDto } from '@luu-sac/shared';
import { User } from '@prisma/client';
import { MESSAGES } from '../constants/messages';
import prisma from '../utils/prisma';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export class AuthService {
  async register(dto: RegisterDto) {
    const existingUser = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new Error(MESSAGES.AUTH.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await argon2.hash(dto.password!);

    const user = await prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        avatar: dto.avatar,
      },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.password) {
      throw new Error(MESSAGES.AUTH.GOOGLE_LOGIN_REQUIRED);
    }

    const isValid = await argon2.verify(user.password, dto.password!);

    if (!isValid) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    return this.generateToken(user);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async googleLogin(token: string) {
    // Basic implementation: In production, verify token with Google API
    // const ticket = await client.verifyIdToken({ ... });
    // const payload = ticket.getPayload();

    // Mocking payload for now
    // You should install google-auth-library
    const payload = {
      email: 'mock@gmail.com',
      name: 'Mock User',
      sub: 'mock_google_id_' + Date.now(),
      picture: 'https://via.placeholder.com/150',
    }; // REPLACE THIS WITH REAL VERIFICATION

    // if (!payload) throw new Error('Invalid Google Token');

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: payload.email,
          name: payload.name,
          avatar: payload.picture,
          googleId: payload.sub,
        },
      });
    } else if (!user.googleId) {
      // Link Google account
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: payload.sub, avatar: user.avatar || payload.picture },
      });
    }

    return this.generateToken(user);
  }

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const resetToken = Math.random().toString(36).substring(2, 15);
    const expires = new Date(Date.now() + 3600000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: expires,
      },
    });

    console.log(`Reset Token for ${email}: ${resetToken}`);

    return { message: MESSAGES.AUTH.RESET_EMAIL_SENT };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: dto.token,
        resetPasswordExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new Error(MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN);
    }

    const hashedPassword = await argon2.hash(dto.newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: MESSAGES.AUTH.PASSWORD_RESET_SUCCESSFUL };
  }
  private generateToken(user: User) {
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '7d',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }
}
