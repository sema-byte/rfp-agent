from langchain_unstructured import UnstructuredLoader


# Process pdf with unstructured
def unstructured_pdf(filepath):

    """
    Process a PDF file using UnstructuredLoader.

    Args:
        filepath (str): The path to the PDF file.

    Returns:
        str: Extracted text content of the PDF.
    """


    loader_local = UnstructuredLoader(
        file_path=filepath,
        # strategy="hi_res",
        chunking_strategy="basic",
        max_characters=1000000,
        include_orig_elements=False,
    #     coordinates=True,
    )

    docs_list_of_chunks = []
    for doc in loader_local.lazy_load():
        docs_list_of_chunks.append(doc)

    text = " ".join(chunk.page_content for chunk in docs_list_of_chunks)
    return text

