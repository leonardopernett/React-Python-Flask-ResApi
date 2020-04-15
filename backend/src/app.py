from flask import Flask, jsonify, request, Response
from flask_pymongo import PyMongo, ObjectId
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from bson import json_util

app = Flask(__name__)
app.config['MONGO_URI']='mongodb://localhost/pythonreactdb'
mongo = PyMongo(app)
CORS(app)



@app.route('/users', methods=['GET'])
def getusers():
    users= []
    data =  mongo.db.users.find()
    #metodo 1 
    # data = json_util.dumps(users)
    # return Response(data, mimetype="application/json")

    #method2
    for item in data:
        users.append({
           '_id':str(ObjectId(item['_id'])),
           'name':item['name'],
           'email':item['email'],
           'password':item['password']
        })
    return jsonify(users)

@app.route('/users/<id>', methods=['GET'])
def getOneusers(id):
    # methodo 1
    # user = mongo.db.users.find_one({'_id':ObjectId(id)})
    # response = json_util.dumps(user)
    # return Response(response, mimetype="application/json")

    #metodo 2
    user = mongo.db.users.find_one({'_id':ObjectId(id)})
    return jsonify({
        '_id':str(ObjectId(user['_id'])),
        'name':user['name'],
        'email':user['email'],
        'password':user['password']
    })

@app.route('/users', methods=['POST'])
def createUser():
     mongo.db.users.insert({
        'name':request.json['name'],
        'email':request.json['email'],
        'password':generate_password_hash(request.json['password'])
     })
     
     return jsonify({
         "message":"users created"
     })

@app.route('/users/<id>', methods=['DELETE'])
def deleteUser(id):
    mongo.db.users.delete_one({'_id':ObjectId(id)})
    return jsonify({
        "message":"deleted user"
    })

@app.route('/users/<id>', methods=['PUT'])
def updateUser(id):
    mongo.db.users.update_one({'_id':ObjectId(id)},{'$set':{
        'name':request.json['name'],
        'email':request.json['email'],
        'password':generate_password_hash(request.json['password'])
    }})
    return jsonify({
        "message":"user was updated"
    })
@app.errorhandler(404)
def page_not_found(error=None):
    message= {
        "text":"page no found error 404",
        "url":request.url
    }

    response = jsonify(message)
    response.status_code=404
    return response

if __name__ == '__main__':
    app.run(debug=True, port=4000)