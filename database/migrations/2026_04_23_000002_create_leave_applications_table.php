<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('leave_applications', function (Blueprint $table) {
            $table->id();
            $table->string('employee_id', 20);
            $table->string('office_school', 200)->default('');
            $table->string('position', 200)->default('');
            $table->date('date_of_filing')->nullable();
            $table->decimal('salary_monthly', 12, 2)->nullable();
            $table->string('leave_type', 100)->default('');
            $table->string('leave_type_other', 200)->default('');
            $table->string('vacation_detail', 50)->default('');
            $table->string('vacation_abroad_specify', 200)->default('');
            $table->string('sick_detail', 50)->default('');
            $table->string('sick_specify', 200)->default('');
            $table->string('women_specify', 200)->default('');
            $table->string('study_detail', 50)->default('');
            $table->string('other_purpose', 50)->default('');
            $table->decimal('num_working_days', 8, 2)->nullable();
            $table->string('inclusive_dates', 200)->default('');
            $table->string('commutation', 20)->default('Not Requested');
            $table->string('attachment_path', 500)->nullable();
            $table->string('attachment_name', 255)->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->string('reviewed_by', 200)->nullable();
            $table->timestamps();

            $table->foreign('employee_id')->references('employee_id')->on('personnel')->onDelete('cascade');
            $table->index(['employee_id', 'status']);
            $table->index('status');
        });
    }
    public function down(): void {
        Schema::dropIfExists('leave_applications');
    }
};