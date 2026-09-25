from ai_backend_connector import save_generated_resume

import json

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    HRFlowable
)


INPUT_FILE = "generated_resume.json"
OUTPUT_FILE = "CareerAI_Resume.pdf"


def load_resume():
    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def generate_pdf(resume):
    doc = SimpleDocTemplate(
        OUTPUT_FILE,
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )

    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        "Name",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=8
    )

    heading_style = ParagraphStyle(
        "Heading",
        parent=styles["Heading2"],
        fontSize=12,
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontSize=10,
        leading=14,
        spaceAfter=4
    )

    story = []

    # Name
    name = resume.get("name", "CareerAI Resume")
    story.append(Paragraph(name, name_style))

    # Professional Summary
    summary = resume.get("professional_summary", "")

    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))
        story.append(Paragraph(summary, body_style))

    # Skills
    skills = resume.get("skills", [])

    if skills:
        story.append(Paragraph("SKILLS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        skills_text = " • ".join(skills)
        story.append(Paragraph(skills_text, body_style))

    # Education
    education = resume.get("education", [])

    if education:
        story.append(Paragraph("EDUCATION", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for edu in education:
            degree = edu.get("degree", "")
            institution = edu.get("institution", "")
            duration = edu.get("duration", "")

            text = f"<b>{degree}</b> — {institution}"

            if duration:
                text += f" ({duration})"

            story.append(Paragraph(text, body_style))

    # Experience
    experience = resume.get("experience", [])

    if experience:
        story.append(Paragraph("EXPERIENCE", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for exp in experience:
            company = exp.get("company", "")
            role = exp.get("role", "")
            duration = exp.get("duration", "")

            story.append(
                Paragraph(
                    f"<b>{role}</b> — {company} ({duration})",
                    body_style
                )
            )

            responsibilities = exp.get("responsibilities", [])

            for responsibility in responsibilities:
                story.append(
                    Paragraph(
                        f"• {responsibility}",
                        body_style
                    )
                )

    # Projects
    projects = resume.get("projects", [])

    if projects:
        story.append(Paragraph("PROJECTS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for project in projects:
            project_name = project.get("name", "")
            description = project.get("description", "")

            story.append(
                Paragraph(
                    f"<b>{project_name}</b>",
                    body_style
                )
            )

            if description:
                story.append(
                    Paragraph(
                        f"• {description}",
                        body_style
                    )
                )

    # Certifications
    certifications = resume.get("certifications", [])

    if certifications:
        story.append(Paragraph("CERTIFICATIONS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for certification in certifications:
            story.append(
                Paragraph(
                    f"• {certification}",
                    body_style
                )
            )

    # Achievements
    achievements = resume.get("achievements", [])

    if achievements:
        story.append(Paragraph("ACHIEVEMENTS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for achievement in achievements:
            story.append(
                Paragraph(
                    f"• {achievement}",
                    body_style
                )
            )

    # Leadership
    leadership = resume.get("leadership", [])

    if leadership:
        story.append(Paragraph("LEADERSHIP", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for item in leadership:
            story.append(
                Paragraph(
                    f"• {item}",
                    body_style
                )
            )

    # Languages
    languages = resume.get("languages", [])

    if languages:
        story.append(Paragraph("LANGUAGES", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        story.append(
            Paragraph(
                " • ".join(languages),
                body_style
            )
        )

    # Links
    links = resume.get("links", [])

    if links:
        story.append(Paragraph("LINKS", heading_style))
        story.append(HRFlowable(width="100%", thickness=1))
        story.append(Spacer(1, 5))

        for link in links:
            story.append(
                Paragraph(
                    f"• {link}",
                    body_style
                )
            )

    doc.build(story)

    print("\n✅ Resume PDF generated successfully!")
    print(f"📄 File: {OUTPUT_FILE}")


def main():
    try:
        resume = load_resume()

        # Send generated resume to backend
        access_token = "YOUR_ACCESS_TOKEN_HERE"
        save_generated_resume(access_token, resume)

        # Generate PDF
        generate_pdf(resume)

    except FileNotFoundError:
        print(f"❌ {INPUT_FILE} not found.")
        print("Generate the resume first.")

    except Exception as e:
        print("❌ Resume generation failed.")
        print("Error:", e)


if __name__ == "__main__":
    main()