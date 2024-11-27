# from langchain.chat_models import ChatOpenAI
# from langchain.chains import RetrievalQA

# def extract_technical_requirements(processed_text):
#     llm = ChatOpenAI(temperature=0.0)
#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         retriever=None,  # Add your retriever if needed
#         return_source_documents=False
#     )
#     question = "Extract the technical components and requirements from the given text."
#     response = qa_chain.run(question, processed_text)
#     return response
