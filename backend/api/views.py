from rest_framework.decorators import api_view
from rest_framework.response import Response
from dotenv import load_dotenv
from openai import OpenAI
import os
import pandas as pd
import re

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)


# views here.
@api_view(["POST"])
def transform(request):
    uploaded_file = request.FILES["file"]
    ext = uploaded_file.name.split(".")[-1].lower()
    filename_without_ext = os.path.splitext(uploaded_file.name)[0]
    if ext == "xlsx":
        df = pd.read_excel(uploaded_file, dtype=str)
        output_filename = f"transformed_{filename_without_ext}.xlsx"
        output_path = os.path.join("media", output_filename)
        df.to_excel(output_path, index=False)
    elif ext == "csv":
        df = pd.read_csv(uploaded_file, dtype=str)
        output_filename = f"transformed_{filename_without_ext}.csv"
        output_path = os.path.join("media", output_filename)
        df.to_csv(output_path, index=False)
    else:
        return Response(
            {"error": "Invalid file! Please upload xlsx or csv only!"}, status=400
        )

    # Remove completely empty rows and columns then replace missing values
    df = df.dropna(how="all")
    df = df.dropna(how="all", axis=1)
    df = df.reset_index(drop=True)
    df = df.fillna("")

    prompt = request.data["prompt"]
    if len(prompt) > 200:
        return Response({"error": "Prompt too long"}, status=400)
    replacement = request.data["replacement"]

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {
                "role": "system",
                "content": "Please generate regex patterns only. Return ONLY raw regex text. No markdown. No explanation. No quotes.",
            },
            {"role": "user", "content": f"Generate regex for: {prompt}"},
        ],
    )

    regex = response.choices[0].message.content

    for column_name in df:
        column = df[column_name]
        for row, cell in enumerate(column):
            new_val = re.sub(regex, replacement, str(cell))
            df[column_name][row] = new_val

    total_rows = len(df)
    total_columns = len(df.columns)

    preview_df = df.iloc[:50, :15]

    rows = min(50, total_rows)
    columns = min(15, total_columns)

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
