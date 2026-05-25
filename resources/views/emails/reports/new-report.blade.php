@component('mail::message')
# 🔔 Laporan IT Baru Masuk

Ada laporan baru yang perlu ditangani. Berikut detailnya:

---

**ID Laporan:** #{{ $report->id }}
**Tanggal:** {{ $report->created_at->format('d M Y, H:i') }} WIB

---

### Data Pelapor
| | |
|---|---|
| **Nama** | {{ $report->reporter_name }} |
| **Email** | {{ $report->reporter_email }} |
| **Telepon** | {{ $report->reporter_phone ?? '-' }} |
| **Perusahaan** | {{ $report->company_name }} |
| **Divisi** | {{ $report->division_name }} |

### Detail Kendala
**Judul:** {{ $report->title }}

**Deskripsi:**
{{ $report->description }}

---

@component('mail::button', ['url' => $adminUrl, 'color' => 'blue'])
Kelola Laporan Ini
@endcomponent

Segera tangani laporan ini agar pelapor mendapat respon yang cepat.

Terima kasih,
**Sistem IT Reporting**
@endcomponent