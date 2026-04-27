<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->string('surname', 100)->default('')->after('employee_id');
            $table->string('given', 100)->default('')->after('surname');
            $table->string('suffix', 20)->default('')->after('given');
        });
    }
    public function down(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->dropColumn(['surname', 'given', 'suffix']);
        });
    }
};