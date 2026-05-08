from rest_framework.decorators import api_view
from rest_framework.response import Response

import pandas as pd
import re


# Create your views here.
@api_view(["GET"])
def test(request):
    return Response({"message": "Backend connected successfully"})


@api_view(["POST"])
def transform(request):
    uploaded_file = request.FILES["file"]
    ext = uploaded_file.name.split(".")[-1].lower()
    if ext == "xlsx":
        df = pd.read_excel(uploaded_file)
    elif ext == "csv":
        df = pd.read_csv(uploaded_file)
    else:
        return Response({"error": "Invalid file"}, status=400)

    df = df.dropna(how="all")
    df = df.dropna(how="all", axis=1)
    df = df.reset_index(drop=True)
    df = df.fillna("")

    prompt = request.data["prompt"]
    replacement = request.data["replacement"]

    for column_name in df:
        column = df[column_name]
        for row, cell in enumerate(column):
            new_val = re.sub(r"\S+@\S+", replacement, str(cell))
            df[column_name][row] = new_val
    return Response(df.to_dict(orient="records"))
