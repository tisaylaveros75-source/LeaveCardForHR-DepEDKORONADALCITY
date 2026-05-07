<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->string('maternal', 100)->default('')->after('suffix');
        });
    }
    public function down(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->dropColumn('maternal');
        });
    }
};
