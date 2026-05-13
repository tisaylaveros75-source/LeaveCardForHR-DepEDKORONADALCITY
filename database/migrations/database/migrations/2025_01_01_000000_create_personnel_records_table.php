<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('personnel_records', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('employee_id', 20);
            $table->string('effective_date', 20)->default('');
            $table->string('designation', 255)->default('');
            $table->string('status_reg', 50)->default('');
            $table->string('salary', 50)->default('');
            $table->string('station', 255)->default('');
            $table->string('source_of_fund', 50)->default('');
            $table->string('last_promotion', 20)->default('');
            $table->string('remarks', 500)->default('');
            $table->timestamps();
            $table->index('employee_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('personnel_records');
    }
};
