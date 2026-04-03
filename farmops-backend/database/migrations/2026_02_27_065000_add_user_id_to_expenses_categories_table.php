<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Add nullable user_id to expenses_categories.
     * NULL  = global/default category (visible to everyone)
     * NOT NULL = user-created custom category (visible only to that user)
     */
    public function up(): void
    {
        Schema::table('expenses_categories', function (Blueprint $table) {
            $table->foreignId('user_id')
                ->nullable()
                ->after('name')
                ->constrained('users')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('expenses_categories', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
