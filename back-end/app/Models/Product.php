<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'old_price',
        'image',
        'stock',
        'status',
        'rating',
        'features',
        'is_featured'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'old_price' => 'decimal:2',
        'stock' => 'integer',
        'rating' => 'decimal:1',
        'features' => 'array',
        'is_featured' => 'boolean'
    ];

    // Accessor to ensure category is always returned as a string
    public function getCategoryAttribute($value)
    {
        return strval($value);
    }

    // Accessor to ensure status is always returned as a string
    public function getStatusAttribute($value)
    {
        return $value ? 'active' : 'inactive';
    }

    // Mutator to convert status string to boolean
    public function setStatusAttribute($value)
    {
        $this->attributes['status'] = $value === 'active';
    }
}
