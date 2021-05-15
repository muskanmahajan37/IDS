from flask import Flask, request, jsonify, make_response
from flask_restplus import Api, Resource, fields
import pandas as pd
import pickle
# from sklearn.externals import joblib

flask_app = Flask(__name__)
app = Api(app = flask_app, 
		  version = "1.0", 
		  title = "ML React App", 
		  description = "Predict results using a trained model")

name_space = app.namespace('prediction', description='Prediction APIs')

model = app.model('Prediction params', 
				  {'textField1': fields.String(required = True, 
				  							   description="Text Field 1", 
    					  				 	   help="Text Field 1 cannot be blank"),
				  'textField2': fields.String(required = True, 
				  							   description="Text Field 2", 
    					  				 	   help="Text Field 2 cannot be blank"),
				  'select1': fields.Integer(required = True, 
				  							description="Select 1", 
    					  				 	help="Select 1 cannot be blank"),
				  'select2': fields.Integer(required = True, 
				  							description="Select 2", 
    					  				 	help="Select 2 cannot be blank"),
				  'select3': fields.Integer(required = True, 
				  							description="Select 3", 
    					  				 	help="Select 3 cannot be blank")})

# classifier = joblib.load('classifier.joblib')

@name_space.route("/")
class MainClass(Resource):

	def options(self):
		response = make_response()
		response.headers.add("Access-Control-Allow-Origin", "*")
		response.headers.add('Access-Control-Allow-Headers', "*")
		response.headers.add('Access-Control-Allow-Methods', "*")
		return response

	def process_data(self, data):
		column_names = ['duration', 'src_bytes', 'dst_bytes', 'num_failed_logins', 'root_shell',
       'su_attempted', 'num_file_creations', 'num_shells', 'num_access_files',
       'num_outbound_cmds', 'is_host_login', 'is_guest_login',
       'Protocol_type_icmp', 'Protocol_type_tcp', 'Protocol_type_udp',
       'service_IRC', 'service_X11', 'service_Z39_50', 'service_auth',
       'service_bgp', 'service_courier', 'service_csnet_ns', 'service_ctf',
       'service_daytime', 'service_discard', 'service_domain',
       'service_domain_u', 'service_echo', 'service_eco_i', 'service_ecr_i',
       'service_efs', 'service_exec', 'service_finger', 'service_ftp',
       'service_ftp_data', 'service_gopher', 'service_hostnames',
       'service_http', 'service_http_443', 'service_imap4', 'service_iso_tsap',
       'service_klogin', 'service_kshell', 'service_ldap', 'service_link',
       'service_login', 'service_mtp', 'service_name', 'service_netbios_dgm',
       'service_netbios_ns', 'service_netbios_ssn', 'service_netstat',
       'service_nnsp', 'service_nntp', 'service_ntp_u', 'service_other',
       'service_pm_dump', 'service_pop_2', 'service_pop_3', 'service_printer',
       'service_private', 'service_remote_job', 'service_rje', 'service_shell',
       'service_smtp', 'service_sql_net', 'service_ssh', 'service_sunrpc',
       'service_supdup', 'service_systat', 'service_telnet', 'service_tftp_u',
       'service_tim_i', 'service_time', 'service_urp_i', 'service_uucp',
       'service_uucp_path', 'service_vmnet', 'service_whois', 'flag_OTH',
       'flag_REJ', 'flag_RSTO', 'flag_RSTOS0', 'flag_RSTR', 'flag_S0',
       'flag_S1', 'flag_S2', 'flag_S3', 'flag_SF', 'flag_SH', 'service_urh_i',
       'service_red_i', 'service_aol', 'service_harvest', 'service_http_8001',
       'service_http_2784']
		
		print(data)
		
		first_row = [0 for col in column_names]
		df = pd.DataFrame(data = [first_row], columns = column_names)
		print(df)
		for key in data:
			if (key=='Protocol_type' or key=='service' or key=='flag'):
				print(key, key+'_'+data[key])
				df[key+'_'+data[key]].iloc[0] = 1
			else:
				print(key, data[key])
				df[key].iloc[0] = data[key]
		filename = 'decision_tree.pkl'
		dec_tree = pickle.load(open(filename, 'rb'))
		res = dec_tree.predict(df)
		res_dict = {
			0: 'No Attack',
			1: 'DoS Attack',
			2: 'Probe Attack',
			3: 'R2L Attack',
			4: 'U2R Attack'
		}
		return res_dict[res[0]]

	@app.expect(model)		
	def post(self):
		try: 
			formData = request.json
			print(formData)
			data = self.process_data(formData)
			# prediction = classifier.predict(data)
			response = jsonify({
				"statusCode": 200,
				"status": "Prediction made",
				"result": "Prediction: " + str(data)
				})
			response.headers.add('Access-Control-Allow-Origin', '*')
			return response
		except Exception as error:
			return jsonify({
				"statusCode": 500,
				"status": "Could not make prediction",
				"error": str(error)
			})