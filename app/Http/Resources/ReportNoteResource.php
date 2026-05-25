<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportNoteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'note'       => $this->note,
            'admin_name' => $this->admin->name,
            'created_at' => $this->created_at->format('d M Y, H:i'),
        ];
    }
}