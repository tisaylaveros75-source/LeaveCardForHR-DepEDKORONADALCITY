<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('leave_records', function (Blueprint $table) {
            $table->decimal('mon_v',  10, 3)->default(0)->after('conversion_date');
            $table->decimal('mon_s',  10, 3)->default(0)->after('mon_v');
            $table->decimal('mon_dv', 10, 3)->default(0)->after('mon_s');
            $table->decimal('mon_ds', 10, 3)->default(0)->after('mon_dv');
            $table->decimal('tr_v',   10, 3)->default(0)->after('mon_ds');
            $table->decimal('tr_s',   10, 3)->default(0)->after('tr_v');
        });
    }
    public function down(): void {
        Schema::table('leave_records', function (Blueprint $table) {
            $table->dropColumn(['mon_v', 'mon_s', 'mon_dv', 'mon_ds', 'tr_v', 'tr_s']);
        });
    }
};
