<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->string('inclusive_dates', 200)->default('')->after('other_purpose');
            $table->unsignedTinyInteger('num_working_days')->nullable()->after('inclusive_dates');
            $table->string('commutation', 20)->default('Not Requested')->after('num_working_days');
        });
    }
    public function down(): void {
        Schema::table('leave_applications', function (Blueprint $table) {
            $table->dropColumn(['inclusive_dates', 'num_working_days', 'commutation']);
        });
    }
};