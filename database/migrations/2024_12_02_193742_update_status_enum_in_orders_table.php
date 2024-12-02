<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateStatusEnumInOrdersTable extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['Pending', 'Accepted', 'Ready', 'Claimed', 'Cancelled'])->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['Pending', 'Accepted', 'Claimed', 'Cancelled'])->change();
        });
    }
}

