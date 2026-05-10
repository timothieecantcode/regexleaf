from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
from openai import OpenAI
from datetime import datetime
from django.conf import settings

import os
import pandas as pd
import re

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


@api_view(["POST"])
def transform(request):
    uploaded_file = request.FILES["file"]

    if not uploaded_file:
        return Response(
            {"error": "No file uploaded"},
            status=400,
        )

    ext = uploaded_file.name.split(".")[-1].lower()
    filename_without_ext = os.path.splitext(uploaded_file.name)[0]

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")

    # Load uploaded spreadsheet
    if ext == "xlsx":
        df = pd.read_excel(uploaded_file, dtype=str)

        output_filename = f"transformed_{timestamp}_{filename_without_ext}.xlsx"

    elif ext == "csv":
        df = pd.read_csv(uploaded_file, dtype=str)

        output_filename = f"transformed_{timestamp}_{filename_without_ext}.csv"

    else:
        return Response(
            {"error": "Invalid file! Please upload xlsx or csv only!"},
            status=400,
        )

    # Clean dataframe
    df = df.dropna(how="all")
    df = df.dropna(how="all", axis=1)
    df = df.reset_index(drop=True)
    df = df.fillna("")

    prompt = request.data["prompt"]

    if len(prompt) > 200:
        return Response(
            {"error": "Prompt too long"},
            status=400,
        )

    replacement = request.data["replacement"]

    # Generate regex pattern using OpenAI
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "Please generate regex patterns only. "
                    "Return ONLY raw regex text. "
                    "No markdown. "
                    "No explanation. "
                    "No quotes."
                ),
            },
            {
                "role": "user",
                "content": f"Generate regex for: {prompt}",
            },
        ],
    )

    regex = response.choices[0].message.content

    # Apply regex replacement across all cells
    for column_name in df:
        column = df[column_name]

        for row, cell in enumerate(column):
            new_val = re.sub(regex, replacement, str(cell))
            df.at[row, column_name] = new_val

    total_rows = len(df)
    total_columns = len(df.columns)

    preview_df = df.iloc[:50, :15]

    rows = min(50, total_rows)
    columns = min(15, total_columns)

    # Ensure media directory exists
    os.makedirs(settings.MEDIA_ROOT, exist_ok=True)

    output_path = os.path.join(settings.MEDIA_ROOT, output_filename)

    # Save transformed file
    if ext == "xlsx":
        df.to_excel(output_path, index=False)

    else:
        df.to_csv(output_path, index=False)

    return Response(
        {
            "preview": preview_df.to_dict(orient="records"),
            "download_url": request.build_absolute_uri(f"/media/{output_filename}"),
            "rows": rows,
            "total_rows": total_rows,
            "columns": columns,
            "total_columns": total_columns,
        }
    )
