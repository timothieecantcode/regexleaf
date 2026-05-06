from rest_framework.decorators import api_view
from rest_framework.response import Response
import pandas as pd


# Create your views here.
@api_view(["GET"])
def test(request):
    return Response({"message": "Backend connected successfully"})


@api_view(["POST"])
def upload(request):
    uploaded_file = request.FILES["file"]
    df = pd.read_excel(uploaded_file)
    df = df.fillna("")
    return Response(df.to_dict(orient="records"))
