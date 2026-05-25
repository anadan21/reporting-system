<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReportDetailResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'ticket'          => '#' . str_pad($this->id, 4, '0', STR_PAD_LEFT),
            'reporter_name'   => $this->reporter_name,
            'reporter_email'  => $this->reporter_email,
            'reporter_phone'  => $this->reporter_phone ?? '-',
            'company_name'    => $this->company_name,
            'division_name'   => $this->division_name,
            'title'           => $this->title,
            'description'     => $this->description,
            'attachment_url'  => $this->attachment_path
                                    ? asset('storage/' . $this->attachment_path)
                                    : null,
            'status'          => $this->status->value,
            'status_label'    => $this->status->label(),
            'status_color'    => $this->status->color(),
            'created_at'      => $this->created_at->format('d M Y, H:i'),
            'notes'           => ReportNoteResource::collection($this->notes),
            'status_histories'=> $this->statusHistories->map(fn($h) => [
                'old_status' => $h->old_status,
                'new_status' => $h->new_status,
                'admin_name' => $h->admin->name,
                'changed_at' => $h->created_at->format('d M Y, H:i'),
            ]),
        ];
    }
}