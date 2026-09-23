import json
import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from ai_backend_connector import save_generated_resume


INPUT_FILE = "generated_resume.json"
OUTPUT_FILE = "generated_resume.pdf"


def load_resume():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def generate_pdf(resume):
    pdf = canvas.Canvas(OUTPUT_FILE, pagesize=A4)

    width, height = A4
    y = height - 50

    pdf.setFont("Helvetica-Bold", 18)

    name = resume.get("name", "Resume")
    pdf.drawString(50, y, name)

    y -= 35

    pdf.setFont("Helvetica", 11)

    for key, value in resume.items():

        if key == "name":
            continue

        if y < 50:
            pdf.showPage()
            y = height - 50
            pdf.setFont("Helvetica", 11)

        if isinstance(value, list):
            pdf.setFont("Helvetica-Bold", 11)
            pdf.drawString(50, y, key.capitalize())
            y -= 18

            pdf.setFont("Helvetica", 10)

            for item in value:
                if isinstance(item, dict):
                    text = " | ".join(
                        f"{k}: {v}" for k, v in item.items()
                    )
                else:
                    text = str(item)

                pdf.drawString(65, y, text[:100])
                y -= 15

        elif isinstance(value, dict):
            pdf.setFont("Helvetica-Bold", 11)
            pdf.drawString(50, y, key.capitalize())
            y -= 18

            pdf.setFont("Helvetica", 10)

            for k, v in value.items():
                pdf.drawString(65, y, f"{k}: {v}")
                y -= 15

        else:
            pdf.setFont("Helvetica-Bold", 11)
            pdf.drawString(50, y, key.capitalize())

            pdf.setFont("Helvetica", 10)
            pdf.drawString(150, y, str(value)[:80])

            y -= 20

    pdf.save()

    print(f"Resume PDF generated: {OUTPUT_FILE}")


def main():
    print("Loading generated resume...")

    resume = load_resume()

    print("Resume loaded successfully.")

    # Send generated resume to backend
    access_token = os.getenv("CAREERAI_ACCESS_TOKEN")

    if access_token:
        print("Sending generated resume to backend...")
        response = save_generated_resume(access_token, resume)

        if response.ok:
            print("Resume successfully sent to backend.")
        else:
            print("Backend rejected the resume.")
    else:
        print("CAREERAI_ACCESS_TOKEN not set.")
        print("Skipping backend upload.")

    # Generate PDF
    generate_pdf(resume)


if __name__ == "__main__":
    main()

