import numpy as np
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import SGDClassifier
from sklearn.neural_network import MLPClassifier
from sklearn import metrics
from raw_data_fetcher import RawData
import string
from sklearn.externals import joblib
import os.path
from sys import argv
from collections import defaultdict
import sys
from sklearn.linear_model import RidgeClassifier
from sklearn.svm import LinearSVC
from sklearn.linear_model import SGDClassifier
from sklearn.linear_model import Perceptron
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.naive_bayes import BernoulliNB, MultinomialNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neighbors import NearestCentroid
from sklearn.ensemble import RandomForestClassifier

def train(x_train_data,y_train_data,count_vect,tfidf_transformer,clf,partial=False):
    #X_train_counts = count_vect.fit_transform(x_train_data)
    #X_train_tfidf = tfidf_transformer.fit_transform(X_train_counts)
    X_train_counts = count_vect.transform(x_train_data)
    X_train_tfidf = tfidf_transformer.transform(X_train_counts)
    
    if partial:
        clf.partial_fit(X_train_tfidf, y_train_data)
    else:
        clf.fit(X_train_tfidf, y_train_data)

def predict(x_test_data,count_vect,tfidf_transformer,clf):
    X_test_counts = count_vect.transform(x_test_data)
    X_test_tfidf = tfidf_transformer.transform(X_test_counts)
    return clf.predict(X_test_tfidf)
    
def custom_preprocessor(str):
	#str = str.translate({ord(char): None for char in string.punctuation})
	return str
	
def custom_tokenizer(str):
	return str.split(' ')

############### MAIN ###############    
    
if len(argv) != 2:
    print "Usage: main_model_one_vs_all <read model from file (0 or 1)>"
    sys.exit()
    
# read model from file
model_file_name = "core_model/SGDClassifier0.model"
count_vect_file_name = "core_model/CountVectorizer0.model"
tfidf_file_name = "core_model/TfidfTransformer0.model"

model_from_file = False

if os.path.isfile(model_file_name) and len(argv) > 1 and argv[1] != "0":
    print "- read model from '%s'" % (model_file_name)
    count_vect = joblib.load(count_vect_file_name) 
    tfidf_transformer = joblib.load(tfidf_file_name) 
    clf = joblib.load(model_file_name)
    model_from_file = True
else:
    print "[Main] ceate new model"
    count_vect = CountVectorizer(tokenizer=custom_tokenizer,analyzer = 'word',preprocessor=custom_preprocessor)
    clf = SGDClassifier(loss='hinge', penalty='l2',alpha=1e-3, n_iter=5, random_state=42)
    tfidf_transformer = TfidfTransformer()

print "[Main] reading data..."
    
raw = RawData()
raw.load(10)

# build transformer
texts = raw.get_all_text()
all_text = []

for text in texts:
    all_text.append(text[1])
    
tmp = count_vect.fit_transform(all_text)
tfidf_transformer.fit(tmp)

model_tags = dict()
models = {
    'SVM': clf,
    #'NB': MultinomialNB(alpha=.01),
    #'ANN' : MLPClassifier(solver='lbfgs', alpha=1e-5,hidden_layer_sizes=(5, 2), random_state=1),
    #'KNN' : KNeighborsClassifier(n_neighbors=10),
    #'RDFOREST' : RandomForestClassifier(n_estimators=25),
    #'NC' : NearestCentroid(),
}

model_avg_score = dict()
model_avg_precision = dict()
model_avg_recall = dict()
model_avg_f1 = dict()

nround_avg = 10;

for model_name,clf in models.iteritems():
    scores = defaultdict(int)
    precision = defaultdict(int)
    recall = defaultdict(int)
    f1 = defaultdict(int)
    
    for rnd in range(nround_avg):
        all_tag_idx = raw.get_all_tag_idx()
        for target_tag in all_tag_idx:
            twenty_train_data,twenty_train_target, twenty_test_data, twenty_test_target = raw.get_train_test_data_tag(target_tag)
            
            twenty_train_data = [data[1] for data in twenty_train_data]
            twenty_test_data = [data[1] for data in twenty_test_data]
            
            if len(twenty_train_target) < 200:
                continue
                   
            # show info
            #print "train sample =",len(twenty_train_target)
            #print "test sample =",len(twenty_test_target)
            
            if model_from_file:
                print "- skip train model..."
            else:
                #print "- train model..."
                #text_clf=text_clf.fit(twenty_train_data, twenty_train_target)
                clf = SGDClassifier(loss='hinge', penalty='l2',alpha=1e-3, n_iter=5, random_state=42)
                train(twenty_train_data,twenty_train_target,count_vect,tfidf_transformer,clf,model_from_file)
                model_tags[target_tag] = clf
                
            #predicted = text_clf.predict(twenty_test_data)
            predicted = predict(twenty_test_data,count_vect,tfidf_transformer,clf)
            score = np.mean(predicted == twenty_test_target)
            
            print "%s score %.2f (%s)-[%d/%d]" % (model_name,score,raw.get_target_names()[target_tag].encode('utf-8'),len(twenty_train_target),len(twenty_test_target))
        
            scores[target_tag] += score
            matrix = metrics.precision_recall_fscore_support(twenty_test_target, predicted,average='binary',pos_label=target_tag)
            precision[target_tag] += matrix[0]
            recall[target_tag] += matrix[1]
            f1[target_tag] += matrix[2]
            
        print "--------------------"
    
    model_avg_score[model_name] = scores
    model_avg_precision[model_name] = precision
    model_avg_recall[model_name] = recall
    model_avg_f1[model_name] = f1

for model,scores in model_avg_score.iteritems():
    print
    print "### %s ###" % model
    
    avg_score = 0
    avg_precision = 0
    avg_recall = 0
    avg_f1 = 0
    count = 0
    for key in scores:
        avg_score += scores[key]/nround_avg
        avg_precision += model_avg_precision[model][key]/nround_avg
        avg_recall += model_avg_recall[model][key]/nround_avg
        avg_f1 += model_avg_f1[model][key]/nround_avg
        count += 1
    
    print "agv     score = %.2f" % (avg_score/count)
    print "agv precision = %.2f" % (avg_precision/count)
    print "agv    recall = %.2f" % (avg_recall/count)
    print "agv        f1 = %.2f" % (avg_f1/count)
    print
    
    print "- save model to file '%s'" % (model_file_name)
    print "- save count vect to file '%s'" % (count_vect_file_name)
    print "- save tfidf to file '%s'" % (tfidf_file_name)
    joblib.dump(clf, model_file_name)
    joblib.dump(count_vect, count_vect_file_name)
    joblib.dump(tfidf_transformer, tfidf_file_name)
    
    break

"""
text_id,text_content = raw.get_test_text()
for tag_id,clf in model_tags.iteritems():
    predicted = predict(text_content,count_vect,tfidf_transformer,clf)
    for tid,result in predict,text_id:
        if result != 0:
            print "%s << %d" % (tid,result)
"""
