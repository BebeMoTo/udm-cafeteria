<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('type')->default('User');
            $table->decimal('balance', 10, 2)->default(0)->nullable();
            $table->decimal('expense', 10, 2)->default(0)->nullable(); 

            $table->string('department')->default("None");
            $table->string('sex')->nullable();
            $table->foreignId('store_id')->nullable()->default(null);
            $table->rememberToken();
            $table->timestamps();
        });
        DB::statement('ALTER TABLE users MODIFY balance DECIMAL(10, 2) UNSIGNED NULL DEFAULT 0');
        DB::statement('ALTER TABLE users MODIFY expense DECIMAL(10, 2) UNSIGNED NULL DEFAULT 0');

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('department');
            $table->dropColumn('sex');
        });
    }
};
