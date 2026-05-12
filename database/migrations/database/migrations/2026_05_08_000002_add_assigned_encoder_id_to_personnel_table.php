<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->unsignedBigInteger('assigned_encoder_id')
                  ->nullable()
                  ->after('assigned_sa_id')
                  ->comment('FK to admin_config.id where role=encoder');
        });
    }
    public function down(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->dropColumn('assigned_encoder_id');
        });
    }
};
