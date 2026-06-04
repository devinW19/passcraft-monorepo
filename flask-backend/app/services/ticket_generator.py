"""
============================================================
FILE: flask-backend/app/services/ticket_generator.py
============================================================
OWNER:        Team Member 4 (Backend Developer — Python/Flask)
TECHNOLOGIES: Python 3.11+, ReportLab (PDF generation),
              qrcode (QR code generation), Pillow (image processing),
              PyMongo, Azure Blob Storage SDK (azure-storage-blob),
              io (BytesIO for in-memory PDF handling)

INSTRUCTIONS FOR TEAM MEMBER 4:
─────────────────────────────────────────────────────────────
This service module generates a branded PDF ticket for a
confirmed booking and optionally uploads it to Azure Blob
Storage, returning a publicly accessible URL. The PDF
contains event details, the ticket number, and a QR code
for entry validation.

STEPS TO IMPLEMENT:

1. Imports:
   - `from reportlab.lib.pagesizes import A4, letter`
   - `from reportlab.lib.units import cm`
   - `from reportlab.lib import colors`
   - `from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle`
   - `from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle`
   - `from reportlab.graphics.shapes import Drawing`
   - `import qrcode`
   - `from PIL import Image as PILImage`
   - `import io`
   - `import os`
   - `from datetime import datetime`
   - Azure SDK (for upload):
   - `from azure.storage.blob import BlobServiceClient, ContentSettings`

2. `generate_qr_code(data: str) -> io.BytesIO` Helper:
   - Generate a QR code image from the `data` string (use the
     ticket number or a validation URL as input):
       `qr = qrcode.QRCode(version=1, box_size=10, border=4)`
       `qr.add_data(data)`
       `qr.make(fit=True)`
       `img = qr.make_image(fill_color='black', back_color='white')`
       `buffer = io.BytesIO()`
       `img.save(buffer, format='PNG')`
       `buffer.seek(0)`
       `return buffer`

3. `generate_ticket_pdf(booking_data: dict) -> io.BytesIO` Function:
   - This is the main ticket generation function.
   - `booking_data` dict should contain:
       { ticket_number, event_title, event_date, event_location,
         user_name, user_email, quantity, total_amount, seat_info }
   - Use ReportLab's `SimpleDocTemplate` and `Platypus` flowables:

   Step a — Create an in-memory PDF buffer:
       `buffer = io.BytesIO()`
       `doc = SimpleDocTemplate(`
       `    buffer,`
       `    pagesize=letter,`
       `    rightMargin=2*cm, leftMargin=2*cm,`
       `    topMargin=2*cm, bottomMargin=2*cm`
       `)`

   Step b — Build the styles:
       `styles = getSampleStyleSheet()`
       Define custom ParagraphStyles for:
       - Title (large, bold, brand colour #6366f1)
       - Subtitle (medium, brand colour)
       - Body text (regular)
       - Label (small, grey, uppercase)

   Step c — Build the content flow (a list of flowables):
       - PassCraft logo (Paragraph or Image from assets/)
       - Title: 'EVENT TICKET'
       - Horizontal rule (Table with coloured background row)
       - Event details table:
           [['Event:', event_title],
            ['Date:',  formatted_date],
            ['Venue:', event_location],
            ['Holder:', user_name],
            ['Email:', user_email],
            ['Ticket #:', ticket_number],
            ['Qty:', quantity],
            ['Total:', f'${total_amount}']]
       - Style the table with TableStyle: alternating row colours,
         bold labels column, brand-coloured borders.
       - Spacer()
       - QR Code image (generate via generate_qr_code(ticket_number)):
           `qr_buffer = generate_qr_code(booking_data['ticket_number'])`
           `qr_image = Image(qr_buffer, width=4*cm, height=4*cm)`
       - Footer text: 'Present this QR code at the venue entrance.'
       - Terms: 'This ticket is non-transferable. PassCraft Ltd.'

   Step d — Build the PDF:
       `doc.build(story)`  # story is the list of flowables
       `buffer.seek(0)`
       `return buffer`

4. `upload_to_azure(pdf_buffer: io.BytesIO, ticket_number: str) -> str` Function:
   - Upload the PDF bytes to Azure Blob Storage and return the URL:
       `connection_string = os.getenv('AZURE_STORAGE_CONNECTION_STRING')`
       `container_name    = os.getenv('AZURE_BLOB_CONTAINER', 'tickets')`
       `blob_name         = f'tickets/{ticket_number}.pdf'`
       `blob_service      = BlobServiceClient.from_connection_string(connection_string)`
       `blob_client       = blob_service.get_blob_client(container=container_name, blob=blob_name)`
       `blob_client.upload_blob(`
       `    pdf_buffer,`
       `    overwrite=True,`
       `    content_settings=ContentSettings(content_type='application/pdf')`
       `)`
       `return f'https://{blob_service.account_name}.blob.core.windows.net/{container_name}/{blob_name}'`

5. `generate_and_store_ticket(booking_data: dict) -> str` (Orchestrator):
   - Calls generate_ticket_pdf() and then upload_to_azure(),
     returning the public URL string to the route handler.
   - The route handler stores this URL in the Booking document's
     `ticketPdfUrl` field via a PUT request to the Node.js API.
============================================================
"""
