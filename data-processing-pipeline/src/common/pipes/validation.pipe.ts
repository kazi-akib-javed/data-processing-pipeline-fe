import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Basic validation example
    if (!value) {
      throw new BadRequestException('No data submitted');
    }

    // Validate email format
    if (value.email && !this.isValidEmail(value.email)) {
      throw new BadRequestException('Invalid email format');
    }

    // Validate password strength
    if (value.password && !this.isValidPassword(value.password)) {
      throw new BadRequestException('Password must be at least 8 characters long and contain at least one number');
    }

    return value;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 8 && /\d/.test(password);
  }
} 