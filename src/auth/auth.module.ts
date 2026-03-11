import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';
import { RolesGuard } from './roles.guard';
import { SupabaseAuthGuard } from './supabase.auth.guard';

// auth.module.ts
@Module({
  imports: [ConfigModule],
  providers: [SupabaseAuthGuard, RolesGuard, SupabaseService],
  exports: [SupabaseAuthGuard, RolesGuard, SupabaseService],
})
export class AuthModule {}