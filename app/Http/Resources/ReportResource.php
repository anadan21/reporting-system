<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'            => $this->id,
            'ticket' => $this->ticket,
            'reporter_name' => $this->reporter_name,
            'unit_business' => $this->unit_business,
            'division_name' => $this->division_name,
            'unit_location' => $this->unit_location,
            
            'title'         => $this->title,
            'description'   => $this->description, // Ditambahkan agar halaman detail bisa membaca isinya
            'attachment_url' => $this->attachment_path ? ('/storage/' . $this->attachment_path) : null,
            'status'        => $this->status->value,
            'status_label'  => $this->status->label(),
            'status_color'  => $this->status->color(),
            'created_at'    => $this->created_at->format('d M Y, H:i'),
            'notes'         => $this->relationLoaded('notes') ? $this->notes->map(function ($note) {
                return [
                    'id'         => $note->id,
                    'note'       => $note->note,
                    'admin_name' => $note->admin->name ?? 'Admin IT',
                    'created_at' => $note->created_at->format('d M Y, H:i'),
                ];
            }) : [],
        ];
    }
}
