import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard('rt-strategy'){
  canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
    const req = context.switchToHttp().getRequest()
    return super.canActivate(context);
  }
  // handleRequest(err, user, info) {
  //       // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
    
}