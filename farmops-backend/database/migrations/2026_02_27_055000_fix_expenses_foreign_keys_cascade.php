<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     * Drop the existing farm_id and crop_id foreign keys on the expenses table
     * and re-add them with ON DELETE CASCADE so that deleting a Farm or Crop
     * automatically removes all related expense records.
     */
    public function up(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            // Drop existing foreign keys (no cascade)
            $table->dropForeign(['farm_id']);
            $table->dropForeign(['crop_id']);

            // Re-add with CASCADE
            $table->foreign('farm_id')
                ->references('id')->on('farms')
                ->cascadeOnDelete();

            $table->foreign('crop_id')
                ->references('id')->on('crops')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->dropForeign(['farm_id']);
            $table->dropForeign(['crop_id']);

            // Restore originals (no cascade)
            $table->foreign('farm_id')->references('id')->on('farms');
            $table->foreign('crop_id')->references('id')->on('crops');
        });
    }
};
