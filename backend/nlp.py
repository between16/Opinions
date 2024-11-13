from textblob import TextBlob as tb

def sentimentRestult(text):

    #creating object blob from class textBlob
    blob = tb(text)

    #to get the value from the sentiment analysis
    sentiment = blob.sentiment.polarity

    #debug to check is value is meaningful
    print(sentiment)

    return sentiment