<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            // Drop the new_price column if it exists
            if (Schema::hasColumn('products', 'new_price')) {
                $table->dropColumn('new_price');
            }

            // Add price column if it doesn't exist
            if (!Schema::hasColumn('products', 'price')) {
                $table->decimal('price', 10, 2)->after('description');
            }

            // Modify status column to be a string
            if (Schema::hasColumn('products', 'status')) {
                $table->dropColumn('status');
            }
            $table->string('status')->default('active')->after('stock');

            // Add any missing columns
            if (!Schema::hasColumn('products', 'stock')) {
                $table->integer('stock')->default(0)->after('image');
            }
            if (!Schema::hasColumn('products', 'rating')) {
                $table->decimal('rating', 3, 1)->nullable()->after('stock');
            }
            if (!Schema::hasColumn('products', 'features')) {
                $table->json('features')->nullable()->after('rating');
            }
            if (!Schema::hasColumn('products', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('features');
            }
        });
    }

    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            // Revert status to boolean
            if (Schema::hasColumn('products', 'status')) {
                $table->dropColumn('status');
            }
            $table->boolean('status')->default(true)->after('stock');

            // Revert price to new_price
            if (Schema::hasColumn('products', 'price')) {
                $table->dropColumn('price');
            }
            $table->decimal('new_price', 10, 2)->after('description');
        });
    }
}; 