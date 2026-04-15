import io
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.colors import HexColor

def generate_pdf_report(upload, insight=None):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72, topMargin=72, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Heading1"],
        fontSize=24,
        textColor=HexColor("#4f46e5"),
        spaceAfter=20,
    )
    
    heading_style = ParagraphStyle(
        "HeadingStyle",
        parent=styles["Heading2"],
        fontSize=16,
        textColor=HexColor("#3730a3"),
        spaceBefore=15,
        spaceAfter=10,
    )
    
    body_style = styles["Normal"]
    body_style.fontSize = 11
    body_style.leading = 14
    
    bullet_style = ParagraphStyle(
        "BulletStyle",
        parent=body_style,
        leftIndent=20,
        bulletIndent=10,
    )
    
    elements = []
    
    # Header
    elements.append(Paragraph("InsightlyAI Report", title_style))
    elements.append(Paragraph(f"<b>Dataset:</b> {upload.filename}", body_style))
    elements.append(Paragraph(f"<b>Created At:</b> {upload.created_at.strftime('%Y-%m-%d %H:%M:%S')} UTC", body_style))
    elements.append(Spacer(1, 20))
    
    if insight and insight.content:
        content = insight.content
        
        # Summary
        if "summary" in content and content["summary"]:
            elements.append(Paragraph("Executive Summary", heading_style))
            elements.append(Paragraph(content["summary"], body_style))
            elements.append(Spacer(1, 10))
        
        # Top Performers
        if "top_performers" in content and content["top_performers"]:
            elements.append(Paragraph("Top Performers", heading_style))
            for item in content["top_performers"]:
                elements.append(Paragraph(f"• {item}", bullet_style))
            elements.append(Spacer(1, 10))
            
        # Trends
        if "trends" in content and content["trends"]:
            elements.append(Paragraph("Key Trends", heading_style))
            for item in content["trends"]:
                elements.append(Paragraph(f"• {item}", bullet_style))
            elements.append(Spacer(1, 10))
            
        # Anomalies
        if "anomalies" in content and content["anomalies"]:
            elements.append(Paragraph("Anomalies & Issues", heading_style))
            for item in content["anomalies"]:
                elements.append(Paragraph(f"• {item}", bullet_style))
            elements.append(Spacer(1, 10))
            
        # Recommendations
        if "recommendations" in content and content["recommendations"]:
            elements.append(Paragraph("Recommendations", heading_style))
            for item in content["recommendations"]:
                elements.append(Paragraph(f"• {item}", bullet_style))
            elements.append(Spacer(1, 10))
    else:
        elements.append(Paragraph("No AI insights yet generated for this dataset.", body_style))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph("To generate insights, open this dataset in InsightlyAI and click 'Generate Insights'.", body_style))

    doc.build(elements)
    buffer.seek(0)
    return buffer
