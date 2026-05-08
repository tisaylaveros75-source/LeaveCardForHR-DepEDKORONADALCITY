<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->unsignedBigInteger('assigned_sa_id')
                  ->nullable()
                  ->after('account_status')
                  ->comment('FK to admin_config.id where role=school_admin');
        });
    }

    public function down(): void
    {
        Schema::table('personnel', function (Blueprint $table) {
            $table->dropColumn('assigned_sa_id');
        });
    }
};
